import { notificationService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class notificationController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        body : Joi.string().required(),
        title : Joi.string().required()
      })

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}