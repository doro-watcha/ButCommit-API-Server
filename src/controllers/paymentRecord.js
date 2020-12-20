import { paymentRecordService, productService, userService } from '../services'
import Joi from '@hapi/joi'
import axios from 'axios'

import { createErrorResponse } from '../utils/functions'

export default class majorController {

  static async create ( req, res ) {

    try {

      const { user } = req

      const result = await Joi.validate(req.body, {
        amount : Joi.number().required(),
        orderNumber : Joi.string().required()
      })

      const { amount , predictTimes } = result

      const modelObj = {
        userId : user.id,
        amount,
        predictTimes
      }

      const paymentRecord = await paymentRecordService.create(modelObj)

      const response = {
        success : true ,
        data : {
          paymentRecord
        }
      }
      res.send(response)

    } catch ( e ){
      res.send(createErrorResponse(e))
    }
  }

  static async findOne ( req, res ) {

    try {
      const { user } = req
      const id = req.params.id

      const paymentRecord = await paymentRecordService.findOne({
        userId : user.id,
        id
      })

      const response = {
        success : true ,
        data : {
          paymentRecord
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

      const result = await Joi.validate ( req.query, {
        amount : Joi.number(),
        predictTimes : Joi.number()
      })

      const { amount , predictTimes} = result 

      const modelObj = {
        userId : user.id,
        amount, 
        predictTimes 
      }


      const paymentRecord = await paymentRecordService.findList(modelObj)

      const response = {
        success : true ,
        data : {
          paymentRecord
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

      const result = await Joi.validate ( req.body, {
        amount : Joi.number(),
        predictTimes : Joi.number()
      })

      const { amount , predictTimes} = result 

    

      const modelObj = {
        amount , predictTimes 
      }

      const paymentRecord = await paymentRecordService.update(id, modelObj)

      const response = {
        success : true ,
        data : {
          paymentRecord
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

      await paymentRecordService.delete(id)

      const response = {
        success : true 
      }

      res.send(response)


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }

  }

  static async authenticate ( req, res ) {

    try {

      const {user} = req

      const result = await Joi.validate ( req.body, {
        imp_uid : Joi.string().required(),
        merchant_uid : Joi.string().required(),
        name : Joi.string().required()
      })
      const { imp_uid , merchant_uid, name } = result

      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: "7836405726138319", // REST API키
          imp_secret: "J1HkjMT3BeF4jbQAR1UHo3FPwMWHKO7uQPP9BJccXShg47QV9LCxOink5k2P8akYZ97BSkOPc65heWcn" // REST API Secret
        }
      })

      const { access_token } = getToken.data.response // 인증 토큰

      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: "get", // GET method
        headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
      })
      const paymentData = getPaymentData.data.response

      // DB에서 결제되어야 하는 금액 조회
      const order = await productService.findOne({name})
      const amountToBePaid = order.amount // 결제 되어야 하는 금액


      const { amount, status } = paymentData

      if ( amountToBePaid == amount ) {

        const modelObj = {
          userId : user.id,
          amount,
          name,
          merchant_uid,
          imp_uid
        }

        const userObj = {
          isMoneyPaid : 1,
          editTimes : user.editTimes + 2,
          consultingTimes : user.consultingTimes + 4
        }
        await userService.update( user.id, userObj)
        await paymentRecordService.create(modelObj)

        const response = {
          success : true 
        }

        res.send(response)

      } else {
        throw Error('PAYMENT_AMOUNT_DIFFERENT')
      }

       
    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }
  
}