import { finalReportService, reportService, userService ,finalReportDataService} from '../services'
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
        userId : user.id,
        majorDataId : report.majorData.id
      }

			// create final report
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

      const result = await Joi.validate ( req.query, {
        userId : Joi.number().required()
      })

      const { userId } = result 

      var finalReports = await finalReportService.findList({userId})

      for ( let i = 0; i < finalReports.length ; i++ ) {

        const majorDataId = finalReports[i].majorDataId

        var otherFinalReports = await finalReportService.findList({majorDataId})

        if ( otherFinalReports.length > 1 ) {
          otherFinalReports.sort(function(a, b){
            return b.report.totalScore - a.report.totalScore
          })
        }

        const finalReportData = await finalReportDataService.findOne({majorDataId})
        const applicantsNumber = finalReportData.applicants + Object.keys(finalReports).length
        const myRank = otherFinalReports.findIndex( function ( item , index) {
          return item.id == finalReports[i].id
        }) + 1

        finalReports[i].applicants = applicantsNumber
        finalReports[i].myRank = myRank
      }

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