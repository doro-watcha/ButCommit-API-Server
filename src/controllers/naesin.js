import { naesinService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class notificationController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        startScore : Joi.number().required(),
        endScore : Joi.number().required(),
        value : Joi.number().required(),
        univName : Joi.string().required(),
        type : Joi.string().required(),
        major : Joi.string().required()
      })

      const { startScore, endScore, value , univName,  type ,major} = result 

      const obj = {
        startScore,
        endScore,
        value,
        univName,
        type,
        major
      }

      await naesinService.create(obj)

      const response = {
        success : true
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne ( req, res) {

    try {

      const result = await Joi.validate(req.body, {
        score : Joi.number().required(),
        univName : Joi.string().required(),
        type : Joi.string().required()
      })

      const { score, univName, type } = result 

      const naesinScore = await naesinService.findOne(score, type , univName )

      const response = {

        success : true ,
        data : {
          value : naesinScore.value
        }
      }
      
      res.send(response)



    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}