import { majorService, universityService, majorDataService, scoreService, } from '../services'
import reportController from './report'
import Joi from '@hapi/joi'
import mime from 'mime'
import path from 'path'
import fs from 'fs'


import { createErrorResponse } from '../utils/functions'

export default class majorController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate ( req.body , {
        line : Joi.string().required(),
        group : Joi.string().required(),
        location : Joi.string().required(),
        recruitmentType : Joi.string().required(),
        univName : Joi.string().required(),
        recruitmentUnit : Joi.string().required(),
        majorName : Joi.string().required()
      })

      const { line , group , location, recruitmentType, univName, recruitmentUnit , majorName } = result 

      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      }

      const major = await majorService.create(modelObj)

      const response = {

        success : true ,
        data : {
          major
        }
      }

      res.send(response)
    
    } catch(e) {
      res.send(createErrorResponse(e))
    }
  }

  

  static async findList(req,res) {

    try { 
      const result = await Joi.validate ( req.query , {
        line : Joi.string(),
        group : Joi.string(),
        location : Joi.string(),
        recruitmentType : Joi.string(),
        univName : Joi.string(),
        recruitmentUnit : Joi.string(),
        majorName : Joi.string()
      })

      const { line , group , location, recruitmentType, univName, recruitmentUnit , majorName } = result 

      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      }

    
      const majors = await majorService.findList(modelObj)

      const response = {
        success : true ,
        data : {
          majors
        }
      }

      res.send(response)
    } catch (e) {
      res.send(createErrorResponse(e))
    }
  }
  
  static async findOne ( req,res) {

    try {

      const id = req.params.id

      const major = await majorService.findOne({id})

      const response = {
        success : true,
        data : {
          major
        }
      }

      res.send(response)


       
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findInternalMajorList ( req, res ) {

    try { 

      const result = await Joi.validate ( req.query , {
        univName : Joi.string().required(),
      })

      const { user } = req 

      const { univName } = result 

      const score = await scoreService.findOne({userId : user.id})

      console.log(univName)

      const majors = await majorService.findList({ univName })

      const majorDataList = []

      for ( let i = 0; i < majors.length ; i++) {


        let majorData = await majorDataService.findOne({majorId : majors[i].id})

        majorDataList.push(majorData)

      }
      majorDataList.sort( function(a,b) {

        return b.prediction.safe - a.prediction.safe
      })

    

      let minGap = 0
      let pickedMajor = null

      for ( let i = 0 ; i < majorDataList.length ; i++) {

        let myScore = await reportController.getScore(score,majorDataList[i], false)
        let difference = myScore - majorDataList[i].prediction.safe

        if ( difference > 0 && difference < minGap) {
          pickedMajor = majorDataList[i].major
        }
        
      }

      const response = {

        success : true ,
        data : {
          majors,
          pickedMajor
        }
      }

      res.send(response)




    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


  static async update ( req, res ) {

    try {

      const id = req.params.id

      const result = await Joi.validate ( req.body , {
        line : Joi.string(),
        group : Joi.string(),
        location : Joi.string(),
        recruitmentType : Joi.string(),
        univName : Joi.string(),
        recruitmentUnit : Joi.string(),
        majorName : Joi.string()
      })

      const { line , group , location, recruitmentType, univName, recruitmentUnit , majorName } = result 

      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      }



      const major = await majorService.update(id ,modelObj)

      const response = {
        success : true ,
        data : {
          major
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

      await majorService.delete(id)

      const response = {
          success : true 
      }

      res.send(response)


    } catch ( e) {
        res.send(createErrorResponse(e))
    }
  }




}