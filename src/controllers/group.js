// import { commitService } from '../services'
import Joi from '@hapi/joi'

import { groupService } from '../services'
import { createErrorResponse } from '../utils/functions'


export default class groupController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {

      })

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

}