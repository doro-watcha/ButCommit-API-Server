import { gradeCutService } from '../services'
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'

import { createErrorResponse } from '../utils/functions'

export default class gradeCutController {

  static async findOne (req, res ) {

    try {

      const result = await Joi.validate ( req.query, {
        year : Joi.number().required(),
        type : Joi.string().required()
      })

      const { year, type } = result 

      const gradeCut = await gradeCutService.findOne({year,type})

      const response = {
        success : true,
        data : {
          gradeCut
        }
      }

      res.send(response)
    
    
    } catch ( e ) {

      res.send(createErrorResponse(e))
    }
  }

  static async upload ( req,res) {
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

  static async parse( req, res) {

    try {

      const result = await Joi.validate ( req.query, {
        year : Joi.number().required(),
        type : Joi.string().required()
      })

      const { year, type } = result 

      const path = ('../excelfile/gradeCut.xlsx')

      await gradeCutService.delete(year,type)

      let workbook = xlsx.readFile(path, {sheetRows: 311})
      let sheetsList = workbook.SheetNames
      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
           header: 1,
           defval: '',
           blankrows: true
      })


      let gradeCut = {}
      let subjectCut = []
      for ( let i = 1 ; i < 311; i++ ) {

        console.log(sheetData[i][0])

        let subject = sheetData[i][0]
        let beforeSubject = sheetData[i-1][0]

        let obj = {
          grade : sheetData[i][1],
          originalScore : sheetData[i][2],
          score : sheetData[i][3],
          percentile : sheetData[i][4]
        }

        subjectCut.push(obj)

        if ( sheetData[i][1] == '9')
        {
          gradeCut[beforeSubject] = subjectCut
          subjectCut = []
        }
      
      }

      const modelObj = {
        gradeCut,
        year,
        type
      }

      await gradeCutService.create(modelObj)

      const response = {
        success : true
      }

      res.send(response)

      

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }


  }

}