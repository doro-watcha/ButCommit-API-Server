import { scoreTransitionService, userService } from '../services'
import Joi from '@hapi/joi'

import mime from 'mime'
import path from 'path'
import fs from 'fs'
import xlsx from 'xlsx'

import { createErrorResponse } from '../utils/functions'
import { SCORE_TRANSITION } from '../utils/variables'

export default class scoreTransitionController {

  static async create ( req, res) {

    try {

      const result = await Joi.validate ( req.body, {
        univName : Joi.string.required(),
        subject : Joi.string.required(),
        score : Joi.object.required()
      })

      const { univName , subject, score } = result 

      const modelObj = {
        univName,
        subject,
        score

      }

      await scoreTransitionService.create(modelObj)

      const response = {
        success : true
      }
      
      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne ( req, res ) {

    try { 

      const result = await Joi.validate ( req.query,{
        univName : Joi.string.required(),
        subject : Joi.string.required()
      })


      const { univName , subject } = result 

      const translatedScore = await scoreTransitionService.findOne({ univName, subject })

      res.send(translatedScore.score)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async parse () {

                 
    const path = ('../excelfile/tomato.xlsx')

    let workbook = xlsx.readFile(path, {sheetRows: 10000})

    let sheetsList = workbook.SheetNames

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

        SCORE_TRANSITION.push(obj)

        await scoreTransitionService.create( obj)

      }

      console.log("good")

    }
  


}

