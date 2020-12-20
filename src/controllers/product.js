import { productService } from '../services'
import Joi from '@hapi/joi'
import axios from 'axios'

import { createErrorResponse } from '../utils/functions'

export default class productController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate ( req.body, {
        name : Joi.string().required(),
        amount : Joi.number().required()
      })

      const { name , amount } = result

      const modelObj = {
        name,
        amount
      }

      await productService.create(modelObj)

      const response = {
        success : true
      }

      res.send (response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

}