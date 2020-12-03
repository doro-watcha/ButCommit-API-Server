import { finalReportService, reportService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class finalReportController {

  static async create (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        reportId : Joi.number().required(),
        group : Joi.string().required()
      })

      const { user } = req

      const { reportId , group } = result 

      const report = await reportService.findOne({id : reportId})

      if ( report == null) throw Error('REPORT_NOT_FOUND')

      const alreadyFinalReport = await finalReportService.findOne({group, userId : user.id})

      if ( alreadyFinalReport != null && group != "군외") throw Error('FINAL_REPORT_ALREADY_EXISTS')

      const modelObj = {
        group,
        reportId,
        userId : user.id
      }

			// create user
			await finalReportService.create(modelObj)

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
      const { user } = req 

      const finalReports = await finalReportService.findList({userId : user.id })

      const response = {
        success : true ,
        data : {
          finalReports 
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

      const finalReport = await finalReportService.findOne({id})

      if ( finalReport == null) throw Error('FINAL_REPORT_NOT_FOUND')

      const response = {
        success : true ,
        data : {
          finalReport 
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
      
      await finalReportService.delete(id)

      const response = {
        success : true 
      }

      res.send(response)

       
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}