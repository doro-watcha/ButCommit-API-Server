
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'
import { majorService, universityService , majorDataService, scoreTransitionService} from '../services'

import { createErrorResponse } from '../utils/functions'

export default class fileController {

  static async uploadMajor ( req, res ) {
    try {
      const files = await Joi.validate(req.files, {
        excel: Joi.array()
          .min(1)
          .required(),
      })


      const response = {
        success : true 
      }
      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async donwloadMajor ( req, res ) {

    try {

      const file = '../excelfile/major.xlsx'


      const mimetype = mime.getType(file)
      const filename = path.basename(file)

      res.download(file, 'major.xlsx')

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


  static async parseMajor(req,res) {

    try { 

       await majorService.deleteAll()
       await majorDataService.deleteAll()
      // await scoreTransitionService.deleteAll()


      
      const path = ('../excelfile/major.xlsx')

      let workbook = xlsx.readFile(path, {sheetRows: 5175})
      let sheetsList = workbook.SheetNames
      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
           header: 1,
           defval: '',
           blankrows: true
      })

      //console.log(sheetData)
      let data = []
      for ( let i = 3 ; i < 5175 ; i++) {

        /*
         * 앞부분만 떼가지고 Major를 하나 만들어준다 ( 이거는 연도에 상관없는 metadata이므로 major로 구분 )
         */
         
        let obj1 = {
          id : i-2,
          line : sheetData[i][0], // 인문 
          group : sheetData[i][1], // 다 
          location : sheetData[i][2], // 경남
          univName : sheetData[i][3], // 가야대 
          recruitmentType : sheetData[i][4], // 일반학생
          sosokUniversity : sheetData[i][5], // 소속대학
          recruitmentUnit : sheetData[i][6], // 경찰행정학과 
          majorName : sheetData[i][7] // 경찰행정학과 
        }


        // const check_major = await majorService.findOne({
        //   univName : sheetData[i][3],
        //   line : sheetData[i][0],
        //   group : sheetData[i][1],
        //   sosokUniversity : sheetData[i][5],
        //   recruitmentUnit : sheetData[i][6],
        //   majorName : sheetData[i][7]
        // })
    

        // if ( check_major == null) await majorService.create(obj1)
        // else await majorService.update(i-2,obj1)

        await majorService.create(obj1)





      //  await majorService.update(i-2,obj1)
      }

      // 2021년 
      for ( let i = 3; i < 5175; i++) {


        let korean_ratio = sheetData[i][58]
        let math_ratio = sheetData[i][59]
        let english_ratio = sheetData[i][60]
        let tamgu_ratio = sheetData[i][61]
        let foreign_ratio = sheetData[i][62]
        let history_ratio = sheetData[i][63]

        let english_multiple_value = sheetData[i][64]
        let history_multiple_value = sheetData[i][65]


        let parsed_data = {
          korean : -1, english : 0 ,math_ga : 0, math_na : 0, tamgu_society : 0 , tamgu_science : 0, history : -1, foreign : foreign_ratio
        }

        parsed_data.korean = korean_ratio
        parsed_data.english = english_ratio
        parsed_data.history = history_ratio

        // 수학 반영비율에서 가,나에 대해서 숫자만 파싱
        if ( math_ratio.indexOf('가') >= 0 ) {
          parsed_data.math_ga = math_ratio.replace(/[^0-9]/g,'')
        } 
        if ( math_ratio.indexOf('나') >= 0 ) {
          parsed_data.math_na = math_ratio.replace(/[^0-9]/g,'')
        }
        
        // 탐구 반영비율에서 사,과에 대해서 숫자만 파싱 
        if ( tamgu_ratio.length > 0 && tamgu_ratio.indexOf('사') >= 0 ) {
          parsed_data.tamgu_society = tamgu_ratio.replace(/[^0-9]/g,'')
        }
        
        if ( tamgu_ratio.length > 0 && tamgu_ratio.indexOf('과') >= 0 ) {
          parsed_data.tamgu_science = tamgu_ratio.replace(/[^0-9]/g,'')
        }


      //예외처리

        var value = -1 
        if ( sheetData[i][35].length > 0 ) value = sheetData[i][35].indexOf("우수한 영역 순")

        /**
         * 33.3 같은 경우에는 파싱을 하면 333이 되는데 이게 100보다 작을것같으면 나누기 10을 한다거나 하고
         * 28.15 같은 경우에도 파싱을 하면 2815가 되는데 나누기 100을해서 28.15로 제대로 파싱을 해주는 코드 
         */

        while ( parsed_data.korean > 100 ) parsed_data.korean = parsed_data.korean / 10
        while ( parsed_data.english > 100 ) parsed_data.english = parsed_data.english / 10
        while ( parsed_data.math_ga > 100 ) parsed_data.math_ga = parsed_data.math_ga / 10
        while ( parsed_data.math_na > 100 ) parsed_data.math_na = parsed_data.math_na / 10
        while ( parsed_data.tamgu_science > 100 ) parsed_data.tamgu_science = parsed_data.tamgu_science / 10
        while ( parsed_data.tamgu_society > 100 ) parsed_data.tamgu_society = parsed_data.tamgu_society / 10
        while ( parsed_data.history > 100 ) parsed_data.history = parsed_data.history / 10 


        var recommendationScore = 0
        if ( sheetData[i][30] != ""  ) recommendationScore = (parseFloat(sheetData[i][30]) + parseFloat(sheetData[i][31] ) )/ 2
        
        if ( value >= 0 ) {
          parsed_data.korean = 35
          parsed_data.math_ga = 25
          parsed_data.math_na = 25
        }
        
        let obj2 = {
          id : i-2,
          year : 2021,
          majorId : i-2,
          metadata : {

            initialMember2021 : sheetData[i][8],
            group2021 : sheetData[i][20],
            additionalMember2021 : sheetData[i][9],
            

            initialMember : sheetData[i][11], // 1
            additionalMember : sheetData[i][12], // 14
            competitionRate : sheetData[i][18],
            group : sheetData[i][21],
            chooHap : sheetData[i][24],

            initialMember2019 : sheetData[i][14],
            additionalMember2019 : sheetData[i][15],
            competitionRate2019 : sheetData[i][19],
            group2019 : sheetData[i][22],
            chooHap2019 : sheetData[i][25],

            reflectionOption : sheetData[i][37],
            reflectionSubject : sheetData[i][38], // 탐,한+국,수,영중 택2
            calculationSpecial : sheetData[i][39],
            tamguNumber : sheetData[i][40], // 1 
            utilizationIndicator : sheetData[i][41],
            applicationIndicator : sheetData[i][43], // 백분위 X 비율 
            applicationIndicatorType : sheetData[i][42], // A
            tamguTranslation :sheetData[i][44],
            tamguReplace :sheetData[i][45],
            specialOption : sheetData[i][47],
            extraType : sheetData[i][49], // 특정 영역 가산 ex ) 수가 5%, 과탐 3% 가산
            extraSubject : sheetData[i][50],
            extraValue : sheetData[i][51],
            extraPoint : sheetData[i][53],
            sooneungSpecial : sheetData[i][54],
        
            perfectScore : sheetData[i][56], // 총 만점 ex) 700 ,
            basicScore : sheetData[i][57],
            emv : english_multiple_value,
            hmv : history_multiple_value,

            balloon : sheetData[i][117]
          },
          prediction : {
            strong : sheetData[i][26], 
            safe : sheetData[i][27],
            dangerous : sheetData[i][28]
          },
          recommendationScore,

          ratio : {
            korean : parsed_data.korean, // (40)
            math : {
              ga : parsed_data.math_ga,
              na : parsed_data.math_na
            }, // 수가나 (40)
            english : parsed_data.english, // (40)
            tamgu : {
              society : parsed_data.tamgu_society,
              science : parsed_data.tamgu_science
            }, // 사과직 10 
            foreign : parsed_data.foreign,
            history : parsed_data.history // 10 
          },
          gradeToScore : {
            english : {
              way : sheetData[i][66], // 수능비율포함 
              score : sheetData[i].slice(67,76)
            },
            history : {
              way : sheetData[i][77], // 수능비율포함
              score : sheetData[i].slice(78,87)
            }
          }
        }

        // const check_major = await majorService.findOne({
        //   univName : sheetData[i][3],
        //   line : sheetData[i][0],
        //   group : sheetData[i][1],
        //   sosokUniversity : sheetData[i][5],
        //   recruitmentUnit : sheetData[i][6],
        //   majorName : sheetData[i][7]
        // })
        // const check_majorData = await majorDataService.findOne({majorId : check_major.id})

        // if ( check_majorData == null) await majorDataService.create(obj2)
        // else await majorDataService.update(i-2,obj2)

        await majorDataService.create(obj2)
      }

      let sheetData1 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[4]], {
        header: 1,
        defval: '',
        blankrows: true
      })

      for ( let i = 1; i < 114 ; i++){

        let obj = {
          id : i,
          name : sheetData1[i][0],
          group : sheetData1[i][1],
          location : sheetData1[i][2],
          min : sheetData1[i][3],
          max : sheetData1[i][4]
        }

        const check_university = await universityService.findOne({
          id : i,
          name : sheetData1[i][0],
          group : sheetData1[i][1],
          location : sheetData1[i][2],
          min : sheetData1[i][3],
          max : sheetData1[i][4]
        })

        if ( check_university == null) await universityService.create(obj)
        else await universityService.update(i,obj)
      }

      let sheetData2 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[5]], {
           header: 1,
           defval: '',
           blankrows: true
      })
    
      var line = sheetData2[0][0]
      var univName = sheetData2[0][1]
      var major = sheetData2[0][2]

      for ( let i = 1; i < 2250; i++) {

        let data = {}

        if ( sheetData2[i][5] == "백분위") {
          data = {
            value : sheetData2[i].slice(56,157)
          }
        } else {
          data = {
            value : sheetData2[i].slice(6,157)
          }
        }

        if ( sheetData2[i][0].length > 1 ) line = sheetData2[i][0]

        if ( sheetData2[i][0].length > 1 ) univName = sheetData2[i][1]

        if ( sheetData2[i][0].length > 1 ) major = sheetData2[i][2]


        let obj = {
          id : i,
          line,
          univName,
          major,
          subject : sheetData2[i][3],
          applicationIndicator : sheetData2[i][5],
          score : data 

        }

        await scoreTransitionService.update(i, obj)

      }


      const response = {
        success : true
        
      }

      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async uploadUniv(req,res) {

    try {

      const files = await Joi.validate(req.files, {
        excel: Joi.array()
          .min(1)
          .required(),
      })


      const response = {
        success : true 
      }

      res.send(response)


    } catch ( e) {
      res.send(createErrorResponse(e))
    }

  }


  static async downloadUniv ( req,res) {

    try {

      const file = '../excelfile/university.xlsx'


      const mimetype = mime.getType(file)
      const filename = path.basename(file)

      res.download(file, 'university.xlsx')

    } catch ( e) {
      res.send(createErrorResponse(e))
    }
  }


  static async parseUniv(req,res) {

    try {

      await universityService.deleteAll()

      const path = ('../excelfile/university.xlsx')

      let workbook = xlsx.readFile(path, {sheetRows: 1574})
      let sheetsList = workbook.SheetNames
      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
           header: 1,
           defval: '',
           blankrows: true
      })

      let data = []
      for ( let i = 1 ; i < 1574 ; i++) {
        let obj1 = {
          id : i,
          name : sheetData[i][0],
          line : sheetData[i][1],
          group : sheetData[i][2],
          location : sheetData[i][3],
          type : sheetData[i][4],
          min : sheetData[i][5],
          max : sheetData[i][6]
        }
        await universityService.create(obj1)
      }

      const response = {
        success : true
      }
    
      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


}