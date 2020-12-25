import { scoreService, testService, majorDataService } from '../services'
import Joi from '@hapi/joi'
import xlsx from 'xlsx'
import mime from 'mime'
import path from 'path'

import { createErrorResponse } from '../utils/functions'
import reportController from './report'

export default class testController {

  static async uploadFile ( req, res ) {

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

  static async downloadFile ( req, res ) {
    
    try {

      const file = '../excelfile/test.xlsx'


      const mimetype = mime.getType(file)
      const filename = path.basename(file)

      res.download(file, 'test.xlsx')

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }


  }

  static async parse ( req, res ) {

    try {


      const result = await Joi.validate(req.query, {
        societyUserId : Joi.number().required(),
        scienceUserId : Joi.number().required()
      })


      const { societyUserId , scienceUserId } = result

 

      const path = ('../excelfile/test.xlsx')
      let workbook = xlsx.readFile(path, {sheetRows: 5175})
      let sheetsList = workbook.SheetNames

      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
           header: 1,
           defval: '',
           blankrows: true
      })


      const scienceScore = await scoreService.findOne({userId : scienceUserId})

     
      const societyScore = await scoreService.findOne({userId : societyUserId})

      if ( scienceScore == null || societyScore == null) throw Error('SCORE_NOT_FOUND')

      let data = []


      await testService.deleteAll()
      var pass = 0
        // 파싱을 해보자 
        for ( let i = 3 ; i < 5139 ; i++) {

      
          const majorData = await majorDataService.findOne({id: i-2})

          if ( majorData == null) throw Error('MAJOR_DATA_NOT_FOUND')

          console.log( "majorDataId야 " + majorData.id)

          let societyAnswer = parseFloat(sheetData[i][10])
          let scienceAnswer = parseFloat(sheetData[i][13])

        

          let societyValue = -1
          let scienceValue = -1


        
          /**
           * 문과 예측 점수 구하기 
           */
      
          if ( isNaN(societyAnswer)) societyAnswer = -1
          else societyValue = await reportController.getScore(societyScore, majorData,false)
 
  
    
          /**
           * 이과 예측 점수 구하기
           */
          if ( isNaN(scienceAnswer)) scienceAnswer = -1
          else scienceValue = await reportController.getScore(scienceScore, majorData, false)
          
          
          
          var societyDeterminant = -1
          var scienceDeterminant = -1


          /**
           * answer이 둘 다 NAN이니깐 data가 없는거임
           */
          if ( societyAnswer == -1 && scienceAnswer == -1) societyDeterminant = 2

          /**
           * 문과 점수 판단하기
           */

          if ( societyValue - societyAnswer <= 0 ) {
            if ( societyValue - societyAnswer >=-5) societyDeterminant = 1
            else societyDeterminant = 0
          } 
          
          if ( societyValue - societyAnswer > 0  ) {
            if ( societyValue - societyAnswer <= 5) societyDeterminant = 1
            else societyDeterminant = 0 

          }

          
          /**
           * 이과 점수 판단하기
           */
        
          if ( scienceValue - scienceAnswer <= 0 ) {
            if ( scienceValue - scienceAnswer >=-5) scienceDeterminant = 1
            else scienceDeterminant = 0
          } 
          

          if ( scienceValue - scienceAnswer > 0  ) {
            if ( scienceValue - scienceAnswer <= 5) scienceDeterminant = 1
            else scienceDeterminant = 0 
          }

          if( scienceDeterminant == 1 && societyDeterminant == 1 ) pass++
            
          console.log("이과예측점수")
          console.log(scienceAnswer)
          console.log("문과예측점수")
          console.log(societyAnswer)
          
          //  if ( (societyDeterminant == 0 || scienceDeterminant == 0 ) ) throw Error('SCORE_NOT_FOUND')

          //  if ( societyDeterminant == -1 && scienceDeterminant == -1) throw Error('SCORE_ALREADY_EXISTS')
          
          let obj = {}
          if ( isNaN(societyValue) == false && isNaN(scienceValue) == false ) {
              obj = {
                id : i-2,
                line : sheetData[i][0], // 인문 
                group : sheetData[i][1], // 다 
                name : sheetData[i][3], // 대학명
                recruitmentType : sheetData[i][6], // 경찰행정학과
                major : sheetData[i][7], // 경찰행정학과
                sosokUniversity : sheetData[i][5],// 사회과학계열
                perfectScore : sheetData[i][9], 
                societyAnswer,
                societyValue,
                societyDeterminant,
                scienceAnswer,
                scienceValue,
                scienceDeterminant
              }
          
          }
          else if ( isNaN(societyValue) == true && isNaN(scienceValue) == true) {

            obj = {
              id : i-2,
              line : sheetData[i][0], // 인문 
              group : sheetData[i][1], // 다 
              name : sheetData[i][3], // 대학명
              recruitmentType : sheetData[i][6], // 경찰행정학과
              major : sheetData[i][7], // 경찰행정학과
              sosokUniversity : sheetData[i][5],// 사회과학계열
              perfectScore : sheetData[i][9], 
              societyDeterminant,
              scienceDeterminant
            }
          }
          // 문과만됨

          else if ( isNaN(scienceValue) == true ) {

            obj = {
              id : i-2,
              line : sheetData[i][0], // 인문 
              group : sheetData[i][1], // 다 
              name : sheetData[i][3], // 대학명
              recruitmentType : sheetData[i][6], // 경찰행정학과
              major : sheetData[i][7], // 경찰행정학과
              sosokUniversity : sheetData[i][5],// 사회과학계열
              perfectScore : sheetData[i][9], 
              societyAnswer,
              societyValue, 
              societyDeterminant,
              scienceAnswer : -1,
              scienceValue : -1,
              scienceDeterminant : -1
            }

          }
          // 문과만됨

          else if ( isNaN(societyValue) == true ){

            obj = {
              id : i-2,
              line : sheetData[i][0], // 인문 
              group : sheetData[i][1], // 다 
              name : sheetData[i][3], // 대학명
              recruitmentType : sheetData[i][6], // 경찰행정학과
              major : sheetData[i][7], // 경찰행정학과
              sosokUniversity : sheetData[i][5],// 사회과학계열
              perfectScore : sheetData[i][9], 
              societyAnswer : -1,
              societyValue : -1,
              societyDeterminant : -1,
              scienceAnswer,
              scienceValue,
              scienceDeterminant
            }
          }

          if ( societyDeterminant == 1 && scienceDeterminant == 1 ) {

          }

          else {
          
            await testService.create(obj)
          }

        }
          

    


      const response = {
        success : true,
        pass
        
      }

      res.send(response)




    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async getList( req, res) {

    try {

      const list = await testService.findAll()

      const response = {
        success : true,
        data : {
          list 
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async test ( req, res ) {

      try {

        const result = await Joi.validate(req.query, {
          userId : Joi.number().required(),
          majorDataId : Joi.number().required()
        })

        const { userId, majorDataId } = result


        const score = await scoreService.findOne({userId})

        const majorData = await majorDataService.findOne({id : majorDataId})

        const detail = await reportController.getScore(score,majorData,true)

        const response = {
          success : true,
          data : {
            detail
          }
        }

        res.send(response)
      }

      catch ( e ) {
        res.send(createErrorResponse(e))
      }


    }
}

