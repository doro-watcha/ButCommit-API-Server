import { consultingService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class consultingController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate (req.body , {
        title : Joi.string().required(),
        description : Joi.string().required(),
        isAdmin : Joi.number(),
        userId : Joi.number().required()
    
      })

      const { title , description , isAdmin, userId } = result 

      const modelObj = {
        title,
        description,
        userId,
        isAdmin 
      }

      const consulting = await consultingService.create(modelObj)

      const response = {
        success : true ,
        data : {
          consulting
        }
      }

      res.send(response)

    } catch ( e ) {

      res.send(createErrorResponse(e))
    }

  }

  static async findList (req, res ) {

    try { 

      const { user } = req 
      const consultings = await consultingService.findList({userId : user.id})

      const response = {
        success : true ,
        data : {
          consultings
        }
      }

      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne ( req, res ) {

    try {

      const id = req.params.id

      const consulting = await consultingService.findOne({
        id
      })

      if ( consulting == null ) throw Error('CONSULTING_NOT_FOUND')

      const response = {
        success : true,
        data : {
          consulting
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async update(req,res) {

    try {

      const { user } = req
      const id = req.params.id

      const result = await Joi.validate (req.body , {
        title : Joi.string(),
        description : Joi.string(),
  
      })

      const { title , description } = result 

      const modelObj = {
        title,
        description,
        userId : user.id
      }

      const consulting = await consultingService.update(id , modelObj)

      const response = {
        success : true,
        data : {
          consulting
        }
      }

      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async delete( req, res ) {

    try { 

      const id = req.params.id

      await consultingService.delete(id)

      const response = {
        success : true
      }

      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }


  }

}