import { highestScoreService } from '../services'
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'


import { createErrorResponse } from '../utils/functions'

export default class highestScoreController {

  static async create ( req, res ) {

    try {


      const result = await Joi.validate (req.body , {
        subject : Joi.string().required(),
        type : Joi.string().required(),
        score : Joi.number().required()
      })

      const { subject, type , score } = result 

      const modelObj = {
        subject,
        type,
        score
      }

      await highestScoreService.create(modelObj)

      const response = {

        success : true 
      }
      
      res.send(response)

    }

    catch (e) {
      res.send(createErrorResponse(e))

    }

  }

}