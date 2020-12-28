
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'
import { majorService, universityService , majorDataService, scoreTransitionService, highestScoreService , naesinService } from '../services'

import { createErrorResponse } from '../utils/functions'

export default class fileController {

  static async upload ( req, res ) {
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


  static async parse(req,res) {

    try { 

       const result = await Joi.validate(req.body,{
         scoreTransition : Joi.number().optional(),
         university : Joi.number().optional(),
         highest : Joi.number().optional(),
         naesin : Joi.number().optional(),
         majorParse : Joi.number().optional()
       })

       const { scoreTransition, university, highest, naesin , majorParse } = result 

             
      const path = ('../excelfile/tomato.xlsx')

      let workbook = xlsx.readFile(path, {sheetRows: 10000})

      let sheetsList = workbook.SheetNames

       /**
        * MajorData를 Parse 해보자....!
        */

      if ( majorParse == 1 ) {

        let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
            header: 1,
            defval: '',
            blankrows: true
        })
        for ( let i = 3 ; i < sheetData.length ; i++) {

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


          const check_major = await majorService.findOne({
            id : i-2
          })


          // 이미 존재하는 과가 있고, 그 과가 현재 파싱하려는 대학이름과 과가 같다 -> 고로 그냥 업데이트 해야한다
          if ( check_major !== null ) {
  
            await majorService.update(i-2,obj1)
          }
          else {
            await majorService.create(obj1)
          }
        }

        // 2021년 
        for ( let i = 3; i < sheetData.length; i++) {


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

              naesinRatio : sheetData[i][92],
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

          const check_major = await majorService.findOne({
            id : i-2
          })

          const check_majorData = await majorDataService.findOne({id : i-2})

          // 이미 존재하는 과가 있고, 그 과가 현재 파싱하려는 대학이름과 과가 같다 -> 고로 그냥 업데이트 해야한다
          if ( check_major !== null && check_majorData !== null ) {
            console.log("Major Data Update")
            await majorDataService.update(i-2,obj2)
          }
          else {
            console.log("Major Data Create")
            await majorDataService.create(obj2)
          }
        }
      }

      if ( naesin == 1 ) {
        
        await naesinService.deleteAll()

      
        let sheetData3 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[3]], {
          header: 1,
          defval: '',
          blankrows: true
        })

        for ( let i = 1 ; i < ( sheetData3.length - 1 ) ; i = i + 4 ) {


          for ( let j = 7 ; j < sheetData3[i].length - 7 ; j++) {

            if (sheetData3[i][j].length == 0 ) break;

            let naesin_section = String(sheetData3[i][j]).split('~')
            let startScore = naesin_section[0]
            let endScore = 0.0

            if ( naesin_section.length > 1 ) {
              endScore = (naesin_section[1])
            } else if ( naesin_section.length == 1 ) {
              endScore = (naesin_section[0])
            }


            let obj = {
              type : "내신",
              univName : sheetData3[i][0],
              recruitmentType : sheetData3[i][1],
              sosokUniversity : sheetData3[i][2],
              recruitmentUnit : sheetData3[i][3],
              applicationIndicator : sheetData3[i][6],
              major : sheetData3[i][4],
              startScore : parseFloat(startScore),
              endScore : parseFloat(endScore),
              value : sheetData3[i+1][j]
            }

            await naesinService.create(obj)


          }

          for ( let j = 7 ; j < sheetData3[i].length - 7; j++){

            if (sheetData3[i+2][j].length == 0 ) break
            else if ( sheetData3[i+2][j] == " ( 수능 점수 - 한국사 점수 ) / 9 ") break
            else if ( sheetData3[i+2][j] == "산출 불가") break
            else if ( sheetData3[i+2][j] == "all") break
            else if ( sheetData3[i+2][j] == "( 국어 백분위 + 수학 백분위 + 영어 환산표 점수 + 탐구 평균 백분위 ) x 1.25") break




            let gumjeong_section = String(sheetData3[i+2][j]).split('~')
            console.log(gumjeong_section)
            let startScore = gumjeong_section[0]
            let endScore = 0.0

            if ( gumjeong_section.length > 1 ) {
              endScore = gumjeong_section[1]
            } else if ( gumjeong_section == 1 ) {
              endScore = gumjeong_section[0]
            }

            let obj = {
              type : "검정고시",
              univName : sheetData3[i][0],
              recruitmentType : sheetData3[i][1],
              sosokUniversity : sheetData3[i][2],
              recruitmentUnit : sheetData3[i][3],
              applicationIndicator : sheetData3[i][6],
              major : sheetData3[i][4],
              startScore : parseFloat(startScore),
              endScore : parseFloat(endScore),
              value : sheetData3[i+3][j]
            }

            await naesinService.create(obj)

          }

        }
      }

      /**
       * 대학검색기준자표 파싱!
       */

       if ( university == 1 ) {

        await universityService.deleteAll()

        let sheetData4 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[4]], {
          header: 1,
          defval: '',
          blankrows: true
        })

        for ( let i = 1; i < sheetData4.length ; i++){

          let obj = {
            id : i,
            name : sheetData4[i][0],
            group : sheetData4[i][1],
            location : sheetData4[i][2],
            min : sheetData4[i][3],
            max : sheetData4[i][4]
          }

          await universityService.create(obj)
        }
      }

      /**
       * 변환 표준점수 파싱!
       */

       if ( scoreTransition == 1 ) {

        await scoreTransitionService.deleteAll()

        let sheetData5 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[5]], {
            header: 1,
            defval: '',
            blankrows: true
        })
      
        var line = sheetData5[0][0]
        var univName = sheetData5[0][1]
        var major = sheetData5[0][2]

        for ( let i = 1; i < sheetData5.length; i++) {

          let data = {}

          if ( sheetData5[i][5] == "백분위") {
            data = {
              value : sheetData5[i].slice(56,157)
            }
          } else {
            data = {
              value : sheetData5[i].slice(6,157)
            }
          }

          if ( sheetData5[i][0].length > 1 ) line = sheetData5[i][0]

          if ( sheetData5[i][0].length > 1 ) univName = sheetData5[i][1]

          if ( sheetData5[i][0].length > 1 ) major = sheetData5[i][2]


          let obj = {
            id : i,
            line,
            univName,
            major,
            subject : sheetData5[i][3],
            applicationIndicator : sheetData5[i][5],
            score : data 

          }

          await scoreTransitionService.create( obj)

        }

      }
      /**
       * 모의고사 영역별 최고점수 파싱
       */

       if ( highest == true ) {

        await highestScoreService.deleteAll()

        let sheetData6 = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[6]], {
          header: 1,
          defval: '',
          blankrows: true
        })

        for ( let i = 1 ; i < sheetData6.length ; i++) {

          let modelObj = {
            id : i + 1,
            subject : sheetData6[i][0],
            type : sheetData6[i][1],
            score : sheetData6[i][2]
          }

          await highestScoreService.create(modelObj)

        }
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