import { redopService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class redopController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        content : Joi.string().required(),
        userId : Joi.number().required(),
        consultingId : Joi.number().required()
      })

      const { content, userId, consultingId } = result 


      const object = {
        content,
        userId,
        consultingId
      }

      await redopService.create(object)

      const response = {
        success : true 
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}