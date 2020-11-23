import { scoreTransitionService, userService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

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



}

