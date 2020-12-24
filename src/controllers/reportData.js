import Joi from '@hapi/joi'
import { majorDataService, reportDataService } from '../services'

import { createErrorResponse } from '../utils/functions'

export default class reportDataController {

  static async create ( req, res ) {

    try {

      await reportDataService.deleteAll()

      for ( let i = 0 ; i <  5136; i++) {

        let majorData = await majorDataService.findOne({id : i+1})

        let modelObj = {
          id : i+1,
          majorDataId : majorData.id
        }

        await reportDataService.create(modelObj)

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

      const reportDataList = await reportDataService.findList({})

      const response = {
        success : true,
        data : reportDataList
      }

      res.send(response)

    }catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findOne ( req, res) {

    try {

      const id = req.params.id 

      const reportData = await reportDataService.findOne({id})

      const response = {
        success : true ,
        data : reportData 
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

      const reportData = await reportDataService.update ( id, modelObj)

      const response = {
        success : true,
        data : reportData
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}