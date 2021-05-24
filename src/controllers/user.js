// import { commitService } from '../services'
import Joi from '@hapi/joi'
import axios from 'axios'
import cheerio from 'cheerio'

import { fcmService, userService } from '../services'
import { createErrorResponse } from '../utils/functions'


export default class commitController {

  static async register (req, res ) {

    try {

      const result = await Joi.validate(req.body, {
        username : Joi.string().required(),
        fcmToken : Joi.string().required()
      })

      const { username , fcmToken } = result

      await axios.get("https://github.com/" + username).catch ( function (error){
        if ( error.response.status == 404) {
          throw Error('USER_NOT_FOUND')
        } 
      })

      const model = {
        username,
        fcmToken
      }

      await userService.register(model)

      const response = {
        success : true
      }

      res.send(response)



    } catch ( e ) {
      res.send(createErrorResponse(e))

    }

  }

  static async update ( req,res ) {

    try {

      const result = await Joi.validate ( req.body, {
        _username : Joi.string().required(),
        username : Joi.string().optional(),
        fcmToken : Joi.string().optional(),
        isDoing : Joi.boolean().optional()
        
      })

      const { _username, username , fcmToken , isDoing } = result 

      await axios.get("https://github.com/" + username).catch ( function (error){
        if ( error.response.status == 404 && username !== undefined ) {
          throw Error('USER_NOT_FOUND')
        } 
      })

      const newUser = { username , fcmToken, isDoing }

      await userService.update ( _username, newUser)

      const response = {
        success : true 
      }

      res.send(response)


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


}