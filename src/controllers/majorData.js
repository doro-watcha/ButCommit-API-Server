import { majorDataService , majorService, scoreService } from '../services'
import Joi from '@hapi/joi'
import xlsx from 'xlsx'
import mime from 'mime'
import path from 'path'
import bycrypt from 'bcrypt'

import { createErrorResponse } from '../utils/functions'

import reportController from './report'

export default class majorDataController {

  static async create ( req, res ) {

    try {

      const result = await Joi.validate ( req.body , {
        year : Joi.number().required(),
        majorId : Joi.number().required(),
        metadata : Joi.object(),
        prediction : Joi.object(),
        ratio : Joi.object(),
        gradeToScore : Joi.object()
      })

      // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, extraPoint, somethingSpecial
      const { year, majorId,  metadata, prediction, ratio, gradeToScore} = result

      const modelObj = {
        year,
        majorId,
        metadata,
        prediction,
        ratio,
        gradeToScore
      }

      const already_majorData = await majorService.findOne({majorId})

      if ( already_majorData == null ) throw Error('MAJOR_NOT_FOUND')

      const majorData = await majorDataService.create(modelObj)

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async findOne(req,res) {

    try {

      const id = req.params.id

      const majorData = await majorDataService.findOne({majorId : id})

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findList(req,res) {

    try {

      var majorDataList = []

      const result = await Joi.validate ( req.query , {
        year : Joi.number(),
        group : Joi.string().optional(),
        location : Joi.array().optional(),
        type : Joi.string().optional(),
        line : Joi.string().optional(),
        univName : Joi.string().optional(),
        mathType : Joi.string().optional(),
        tamguType : Joi.string().optional()
      })

      const { year, group, type ,location, line, univName , mathType, tamguType } = result

      console.log(group)
      console.log(location)
      console.log(type)
      console.log(line)
      console.log(univName)
      console.log(mathType)
      console.log(tamguType)

      const modelObj = {
        year
      }

      const { user } = req 

      const score = await scoreService.findOne({userId : user.id})

      const majorDataNotFiltered = await majorDataService.findList(modelObj)

      majorDataList = majorDataNotFiltered
      

      // 군 필터링
      if ( group !== undefined && group !== "전체") {
        majorDataList = majorDataList.filter ( item => {
          return item.major.group === group 
        })
        
      }
      // 대학 이름 필터링
      if ( univName !== undefined ) {
        majorDataList = majorDataList.filter ( item => {
          return item.major.univName === univName
        })
      }

      // 계열 필터링
      if ( line !== undefined && line !== "전체") {
        majorDataList = majorDataList.filter ( item => {
          return item.major.line === line
        })
      }
      
      // 지역 필터링
      if ( location !== undefined) {

        majorDataList = majorDataList.filter ( item => {
          return location.includes(item.major.location)
        })

      }

      // 종류/분야 필터링

      if ( type !== undefined && type !== "전체") {

        if ( type === "간호") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName.indexOf("간호") >= 0
          })
        }
        else if ( type === "의예") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "의예과"
          })
        }
        else if ( type === "의학") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "의학과"
          })

        }

        else if ( type === "치의") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "치의예과"
          })

        }
        else if ( type === "초등교육") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "초등교육과"
          })

        }
        else if ( type === "한의") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "한의예과"
          })

        }
        else if ( type === "수의") {
          majorDataList = majorDataList.filter ( item => {
            return item.major.majorName === "수의예과"
          })

        }
      }

      // 수학 가/나 필터링
      if ( mathType !== undefined) {

        if ( mathType === "가") {
          majorDataList = majorDataList.filter ( item => {
            return item.ratio.math.ga > 0
          })
        }

        else if ( mathType ==="나") {
          majorDataList = majorDataList.filter ( item => {
            return item.ratio.math.na > 0
          })

        }
      }

      // 과탐 ,사탐 필터링
      if ( tamguType !== undefined ) {

        if ( tamguType === "과탐") {
          majorDataList = majorDataList.filter ( item => {
            return item.ratio.tamgu.science > 0
          })
        }
        else if ( tamguType === "사탐") {
          majorDataList = majorDataList.filter ( item => {
            return item.ratio.tamgu.society > 0
          })
        }
      }


      console.log(majorDataNotFiltered.length)
      console.log(majorDataList.length)


      let majorDatas = []
      for ( let i = 3 ; i < majorDataList.length ; i++){


        let majorData = majorDataList[i-3]


        let transitionScore = 0
        
        if ( score.line == "인문" && majorData.ratio.tamgu.society > 0 ) {
          transitionScore = await reportController.getScore(score,majorData,false)
        }
        else if (  score.line == "자연" && majorData.ratio.tamgu.science > 0){
          transitionScore = await reportController.getScore(score,majorData,false)
        }

        let prediction = "최초합유력"

        if ( majorData.prediction.strong > transitionScore && transitionScore >= majorData.prediction.safe ) {
          prediction = "지원 적정"
        } 
        else if ( majorData.prediction.safe > transitionScore && transitionScore >= majorData.prediction.dangerous ) {
          prediction = "추합 스나이핑"
        }
        else if ( majorData.prediction.dangerous > transitionScore) {
          prediction = "위험 불합격"
        }
        let obj = {
          majorData,
          prediction,
          myScore : transitionScore,
          majorScore : majorData.prediction.safe
        }
        majorDatas.push(obj)
      }

      const response = {
        success : true,
        data : {
          majorDatas
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async update(req,res) {

    try {

      const id = req.params.id

      const result = await Joi.validate ( req.body , {
        majorId : Joi.number(),
        year : Joi.number(),
        metadata : Joi.object(),
        prediction : Joi.object(),
        ratio : Joi.object(),
        gradeToScore : Joi.object()
      })

      // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, additionalPoint, somethingSpecial
      const { majorId , year, metadata, prediction, ratio, gradeToScore} = result

      const modelObj = {
        majorId,
        year,
        metadata,
        prediction,
        ratio,
        gradeToScore
      }

      const majorData = await majorDataService.update(id, modelObj)

      const response = {
        success : true,
        data : {
          majorData
        }
      }

      res.send(response)

    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

  static async delete (req, res) {

    try {
      
      const id = req.params.id

      await majorDataService.delete(id)

      const response = {
        success : true
      }
      res.send(response)
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async findListByFilter ( req ,res) {

    try {

      const { req } = user 

      const result = await Joi.validate(req.query, {
        group : Joi.string().optional(),
        location : Joi.string().optional(),
        type : Joi.string().optional(),
        line : Joi.string().optional(),
        univName : Joi.string().optional(),
        mathType : Joi.string().optional(),
        tamguType : Joi.string().required(),

      })

      const { group, location, type , line , univName, mathType, tamguType} = result 

      const options = {
        group,
        location,
        type,
        line,
        univName,
        mathType,
        tamguType
      }

      const majorDataList = await majorDataService.findByFilter(options)



    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }

}