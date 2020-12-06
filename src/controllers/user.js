import { userService, reportService, scoreService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class userController {


    static async findOne ( req, res ) {

        try {
            const id = req.params.id 

            const user = await userService.findOne({id})

            if (user == null) throw Error('USER_NOT_FOUND')   

            const response = {

                success : true ,
                data : {
                  user
                }
            }
            res.send(response)

        } catch ( e) {
            res.send ( createErrorResponse(e))
        }

    }

    static async findList(req,res) {

      try {

        const result = await Joi.validate ( req.query , {
          academyId : Joi.number(),
        })

        const { academyId } = result 

        const where = {
          academyId
        }

        const user = await userService.findList(where)

        const response = {
          success : true ,
          data : {
            user
          }
        }

        res.send(response)


      } catch ( e) {
        res.send(createErrorResponse(e))
      }
    }


    static async update ( req, res ) {

        try {

          const id = req.params.id

          const result = await Joi.validate ( req.body , {
            name : Joi.string(),
            highSchool : Joi.string(),
            line : Joi.string(),
            graduateYear : Joi.number(),
            editTimes : Joi.number(),
            gender : Joi.string(),
            haknyeon : Joi.string(),
            academyId : Joi.number(),
            adminLevel : Joi.number(),
            telephone : Joi.string(),
            isMoneyPaid : Joi.number()
            
          })

          const { name , highSchool , line, graduateYear , gender , haknyeon, academyId, adminLevel, telephone, isMoneyPaid } = result 


          const modelObj = {
            name,
            highSchool,
            line,
            graduateYear,
            gender,
            haknyeon,
            academyId,
            adminLevel,
            telephone,
            isMoneyPaid
          }

          const user = await userService.update(id, modelObj )

          const response = {
            success : true ,
            data : {
              user 
            }
          }

          res.send (response)
        } catch ( e ) {
            res.send( createErrorResponse(e))
        }



    }

    static async delete ( req, res ) {

        try {

            const id = req.params.id 

            await userService.delete(id)

            const response = {
                success : true 
            }

            res.send(response)


        } catch ( e) {
            res.send(createErrorResponse(e))
        }


    }
}

