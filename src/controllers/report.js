import { reportService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class reportController {

  static async create ( req, res ) {

    try {
      const { user } = req
      const result = await Joi.validate ( req.body, {
        score : Joi.number(),
        majorDataId : Joi.number()
      })

      const { score , majorDataId  } = result



      const modelObj = {
        score,
        majorDataId,
        userId : user.id
      }

      const report = await reportService.create(modelObj)

      const response = {
        success : true ,
        data : {
          report
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

      const report = await reportService.findOne({id})

      if ( report == null ) throw Error('REPORT_NOT_FOUND')

      const response = {
        success : true,
        data : {
          report
        }
      }
      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findList ( req, res ) {

    try {

      const { user } = req 
      const reports = await reportService.findList(user.id)


      const response = {
        success : true,
        data : {
          reports
        }
      }
      res.send(response)

    } catch ( e ) {

      res.send(createErrorResponse(e))
    }

  }

  static async update ( req, res) {

    try {

      const id = req.params.id

      const result = await Joi.validate (req.body ,{
        score : Joi.number(),
        majorDataId : Joi.number(),
        userId : Joi.number()
      })

      const { score, majorDataId, userId } = result

      const modelObj = {
        score , majorDataId, userId 
      }

      const updateReport = await reportService.update(id , modelObj )

      const response = {
        success : true,
        data : {
          updateReport 
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

      await reportService.delete(id)

      const response = {
          success : true 
      }

      res.send(response)


  } catch ( e) {
      res.send(createErrorResponse(e))
  }


  }

}
