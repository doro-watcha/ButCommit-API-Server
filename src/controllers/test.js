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

 

      const path = ('../excelfile/major.xlsx')
      let workbook = xlsx.readFile(path, {sheetRows: 5563})
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
        // 파싱을 해보자 
        for ( let i = 3; i < 5563 ; i++) {

      
          const majorData = await majorDataService.findOne({id: i-2})

          if ( majorData == null) throw Error('MAJOR_DATA_NOT_FOUND')

          console.log( "majorDataId야 " + majorData.id)

          var value = -1

          
          if ( sheetData[i][0] == "인문") {
      
            value = await reportController.getScore(societyScore, majorData,false)
  
    
          } else {

            value = await reportController.getScore(scienceScore, majorData, false)
          
          }

      
          const answer = parseFloat(sheetData[i][26])

            var determinant = -1

            if ( value - answer < 0 && answer - value > -3) {
              determinant = 0
            }

            if ( value - answer > 0 && value - answer < 3 ) {
              determinant = 1
            }

            if ( !isNaN(answer) && determinant != -1) {

              console.log("test값은 = ")
              console.log(value)

              console.log("answer값은 = ")
              console.log(answer)

              let obj1 = {
                id : i-2,
                line : sheetData[i][0], // 인문 
                group : sheetData[i][1], // 다 
                name : sheetData[i][3], // 대학명
                recruitmentType : sheetData[i][6], // 경찰행정학과
                major : sheetData[i][7], // 경찰행정학과
                sosokUniversity : sheetData[i][5],// 사회과학계열
                perfectScore : sheetData[i][56], 
                answer,
                test : value,
                result : determinant
              }
              data.push(obj1)
            await testService.create(obj1)
          }
          else {

            let obj2 = {
              id : i-2,
              line : sheetData[i][0], // 인문 
              group : sheetData[i][1], // 다 
              name : sheetData[i][2], // 대학명
              recruitmentType : sheetData[i][6], // 경찰행정학과
              major : sheetData[i][7], // 경찰행정학과
              sosokUniversity : sheetData[i][5],// 사회과학계열
              result : -1
            }

            await testService.create(obj2)
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

