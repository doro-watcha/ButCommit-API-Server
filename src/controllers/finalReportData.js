import Joi from '@hapi/joi'
import { majorDataService, finalReportDataService } from '../services'

import { createErrorResponse } from '../utils/functions'

export default class finalReportDataController {

  static async create ( req, res ) {

    try {

      await finalReportDataService.deleteAll()

      for ( let i = 0 ; i < 5136 ; i++) {

        let majorData = await majorDataService.findOne({id : i+1})

        let modelObj = {
          id : i+1,
          majorDataId : majorData.id
        }

        await finalReportDataService.create(modelObj)

      }

      const response = {
        success : true 
      }

      res.send (response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findList ( req, res) {

    try {

      const finalReportDataList = await finalReportDataService.findList({})

      const response = {
        success : true,
        data : finalReportDataList
      }

      res.send(response)

    }catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findOne ( req, res) {

    try {

      const id = req.params.id 

      const finalReportData = await finalReportDataService.findOne({id})

      const response = {
        success : true ,
        data : finalReportData 
      }

      res.send(response)

    } catch ( e) {
      res.send(createErrorResponse(e))
    }
  }

  static async update ( req, res) {

    try {

      const id = req.params.id

      const result = await Joi.validate ( req.body,{
        applicants : Joi.number().required()
      })

      const { applicants } = result 

      const modelObj = {
        applicants
      }

      const finalReportData = await finalReportDataService.update ( id, modelObj)

      const response = {
        success : true,
        data : finalReportData
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}