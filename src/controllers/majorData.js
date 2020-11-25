import { majorDataService , majorService, scoreService } from '../services'
import Joi from '@hapi/joi'
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
      for ( let i = 0 ; i < majorDataList.length ; i++){

        let majorData = majorDataList[i]

        let transitionScore = await reportController.getScore(score, majorData,false)
        let prediction = "유력"

        if ( majorData.prediction.safe > transitionScore && transitionScore >= majorData.prediction.dangerous ) {
          prediction = "적정"
        } 
        else if ( majorData.prediction.dangerous > transitionScore && transitionScore >= majorData.prediction.sniping ) {
          prediction = "추합"
        }
        else if ( majorData.prediction.sniping > transitionScore) {
          prediction = "위험"
        } else {
          prediction = null
        }
        let obj = {
          majorData : majorDataList[i],
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