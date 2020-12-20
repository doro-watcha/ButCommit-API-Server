import { majorDataService , majorService, scoreService } from '../services'
import Joi from '@hapi/joi'
import xlsx from 'xlsx'
import mime from 'mime'
import path from 'path'
import bycrypt from 'bcrypt'

import { createErrorResponse } from '../utils/functions'

import reportController from './report'

export default class majorDataController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate ( req.body , {
        year : Joi.number().required(),
        majorId : Joi.number().required(),
        metadata : Joi.object(),
        prediction : Joi.object(),
        ratio : Joi.object(),
        gradeToScore : Joi.object()
      })

      // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, extraPoint, somethingSpecial
      const { year, majorId,  metadata, prediction, ratio, gradeToScore} = result

      const modelObj = {
        year,
        majorId,
        metadata,
        prediction,
        ratio,
        gradeToScore
      }

      const already_majorData = await majorService.findOne({majorId})

      if ( already_majorData == null ) throw Error('MAJOR_NOT_FOUND')

      const majorData = await majorDataService.create(modelObj)

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne(req,res) {

    try {

      const id = req.params.id

      const majorData = await majorDataService.findOne({majorId : id})

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findList(req,res) {

    try {

      const path = ('../excelfile/test.xlsx')
      let workbook = xlsx.readFile(path, {sheetRows: 3524})
      let sheetsList = workbook.SheetNames

      let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
           header: 1,
           defval: '',
           blankrows: true
      })


      const result = await Joi.validate ( req.query , {
        year : Joi.number(),
        majorId : Joi.number()
      })

      const { year, majorId} = result

      const modelObj = {
        year,
        majorId
      }

      const { user } = req 

      const score = await scoreService.findOne({userId : user.id})

      const majorDataList = await majorDataService.findList(modelObj)

      let majorDatas = []
      for ( let i = 3 ; i < 3524 ; i++){


        let societyAnswer = parseFloat(sheetData[i][19])
        let scienceAnswer = parseFloat(sheetData[i][20])

        let majorData = majorDataList[i-3]

        console.log("SocietyAnswer == " + societyAnswer)
        console.log("scienceAnswer = " + scienceAnswer)
        console.log(score.line)
        console.log(majorData.major.majorName)
        console.log(majorData.major.univName)


        let transitionScore = 0
        
        if ( isNaN(societyAnswer) == false && score.line == "인문" ) {
          transitionScore = await reportController.getScore(score,majorData,false)
        }
        else if ( isNaN(scienceAnswer) == false && score.line == "자연"){
          transitionScore = await reportController.getScore(score,majorData,false)
        }

        let prediction = "최초합유력"

        if ( majorData.prediction.strong > transitionScore && transitionScore >= majorData.prediction.safe ) {
          prediction = "지원 적정"
        } 
        else if ( majorData.prediction.safe > transitionScore && transitionScore >= majorData.prediction.dangerous ) {
          prediction = "추합 스나이핑"
        }
        else if ( majorData.prediction.dangerous > transitionScore) {
          prediction = "위험 불합격"
        }
        let obj = {
          majorData,
          prediction,
          myScore : transitionScore,
          majorScore : majorData.prediction.safe
        }
        majorDatas.push(obj)
      }

      const response = {
        success : true,
        data : {
          majorDatas
        }
      }

      const eTag = user.email
      res.set('Cache-Control', `no-cache, private, max-age=36000`)
      res.set('etag',eTag)


      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async update(req,res) {

    try {

      const id = req.params.id

      const result = await Joi.validate ( req.body , {
        majorId : Joi.number(),
        year : Joi.number(),
        metadata : Joi.object(),
        prediction : Joi.object(),
        ratio : Joi.object(),
        gradeToScore : Joi.object()
      })

      // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, additionalPoint, somethingSpecial
      const { majorId , year, metadata, prediction, ratio, gradeToScore} = result

      const modelObj = {
        majorId,
        year,
        metadata,
        prediction,
        ratio,
        gradeToScore
      }

      const majorData = await majorDataService.update(id, modelObj)

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async delete (req, res) {

    try {
      
      const id = req.params.id

      await majorDataService.delete(id)

      const response = {
        success : true
      }
      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

}