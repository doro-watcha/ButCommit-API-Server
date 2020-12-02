import { communityService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class commentController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        content : Joi.string().required()
      })

      const { user } = req


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne( req, res ) {

    try {

      


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


  static async findList ( req, res) {

    try {


    } catch ( e ) {


    }

  }

  static async delete ( req, res ) {

    try {


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}