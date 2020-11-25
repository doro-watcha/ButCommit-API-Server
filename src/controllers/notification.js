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

      const { body , title } = result 


      const modelObj = {
        body,
        title
      }

			await notificationService.create(modelObj)

			// create response
			const response = {
				success: true,
			}

			res.send(response)

    } catch ( e ) {

      res.send(createErrorResponse(e))
    }
  }

  static async findList ( req, res) {
    try { 

      const notifications = await notificationService.findList({})

      const response = {
        success : true ,
        data : {
          notifications 
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne( req,res ) {
    try {

      const id = req.params.id

      const notification = await notificationService.findOne({id})

      if ( notification == null) throw Error('NOTIFICATION_NOT_FOUND')

      const response = {
        success : true ,
        data : {
          notification 
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


  static async update (req, res) {
    try {

      const id = req.params.id

      const result = await Joi.validate (req.body, {
        title : Joi.string(),
        body : Joi.string()
      })

      const { title, body  } = result 

      const modelObj = {
        title, body
      }

      const notification = await notificationService.update(id, modelObj)

      const response = {
        success : true ,
        data : {
          notification 
        }
      }
      res.send(response)


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async delete ( req, res ) {

    try {
      const id = req.params.id
      
      await notificationService.delete(id)

      const response = {
        success : true 
      }

      res.send(response)

       
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}