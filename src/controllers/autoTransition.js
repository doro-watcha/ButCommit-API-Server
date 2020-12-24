
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

      let workbook = xlsx.readFile(path, {sheetRows: 1283})
      let sheetsList = workbook.SheetNames
      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
           header: 1,
           defval: '',
           blankrows: true
      })


      let obj = {}
      for ( let i = 1 ; i < 1283 ; i++) {

        if ( sheetData[i][0] == "영어" || sheetData[i][0] == "한국사") {
          obj = {
            id : i,
            subject : sheetData[i][0],
            grade : sheetData[i][3]
          }

        } else {

          obj = {
            id : i,
            subject : sheetData[i][0],
            score : sheetData[i][1],
            percentile : sheetData[i][2],
            grade : sheetData[i][3]
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
        score : Joi.number().required()
      })

      const { subject , score } = result 

      const autoTransition = await autoTransitionService.findOne({subject, score})

      if ( autoTransition == null ) throw Error('AUTO_TRANSITION_NOT_FOUND')

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
