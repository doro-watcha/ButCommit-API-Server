
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'
import { autoTransitionService  } from '../services'

import { createErrorResponse } from '../utils/functions'

export default class fileController {

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

  static async parseFile(req,res) {

    try {

      await autoTransitionService.deleteAll()
      
      const path = ('../excelfile/autoTransition.xlsx')

      let workbook = xlsx.readFile(path, {sheetRows: 1521})
      let sheetsList = workbook.SheetNames
      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
           header: 1,
           defval: '',
           blankrows: true
      })


      let obj = {}
      for ( let i = 1 ; i < 1521 ; i++) {

        if ( sheetData[i][0] == "영어" || sheetData[i][0] == "한국사") {
          obj = {
            subject : sheetData[i][0],
            originalScore : sheetData[i][1],
            grade : sheetData[i][4]
          }

        } else {

          obj = {

            subject : sheetData[i][0],
            originalScore : sheetData[i][1],
            score : sheetData[i][2],
            percentile : sheetData[i][3],
            grade : sheetData[i][4]
          }
        }

        await autoTransitionService.create(obj)
      }


      const response = {
        success : true

      }

      res.send(response)
      
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne( req, res) {


    try {

      const result = await Joi.validate ( req.query , {

        subject : Joi.string().required(),
        originalScore : Joi.number().required()
      })

      const { subject , originalScore} = result 

      const autoTransition = await autoTransitionService.findOne({subject, originalScore})

      const response = {

        success : true ,
        data : {
          autoTransition 
        }
      }
      
      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}
