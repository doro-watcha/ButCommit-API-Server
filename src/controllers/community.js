import { communityService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class communityController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        body : Joi.string().required(),
        title : Joi.string().required()
      })

      const { body , title } = result 

      const { user } = req 

      const modelObj = {
        body,
        title,
        userId : user.id 
      }

			// create user
			await communityService.create(modelObj)

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

      const communities = await communityService.findList({})

      const response = {
        success : true ,
        data : {
          communities 
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

      const community = await communityService.findOne({id})

      if ( community == null) throw Error('COMMUNITY_NOT_FOUND')

      const response = {
        success : true ,
        data : {
          community 
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

      const community = await communityService.update(id, modelObj)

      const response = {
        success : true ,
        data : {
          community 
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
      
      await communityService.delete(id)

      const response = {
        success : true 
      }

      res.send(response)

       
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}