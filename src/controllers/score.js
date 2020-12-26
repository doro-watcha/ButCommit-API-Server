import { scoreService, userService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class scoreController {

    static async create ( req, res ) {

        try {

            const result = await Joi.validate(req.body, {
                korean : Joi.object().required(),
                math : Joi.object().required(),
                english : Joi.object().required(),
                tamgu1 : Joi.object().required(),
                tamgu2 : Joi.object().required(),
                history : Joi.object().required(),
                foreign : Joi.object().optional(),
                line : Joi.string().required(),
                naesinScore : Joi.number(),
                naesinType : Joi.string()
            })
            
            const { korean , math , english , tamgu1, tamgu2 , history ,foreign, line, naesinScore, naesinType } = result 

            const { user } = req

            const modelObj = {
                userId : user.id,
                korean,
                math,
                english,
                tamgu1,
                tamgu2,
                history,
                foreign,
                line,
                naesinScore,
                naesinType,
                gumjeong
            }

            const newUser = {
                editTimes : user.editTimes - 1,
                searchScore : (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile ) / 4
            }
            if ( user.editTimes <= 0 ) throw Error('EDIT_TIMES_NOT_FOUND')
            else await userService.update(user.id, newUser)

            const exist_score = await scoreService.findOne({userId : user.id})

            if ( exist_score != null) throw Error('SCORE_ALREADY_EXISTS')
            const score = await scoreService.create( modelObj )

            const response = {

                success : true,
                data : {
                    score 
                }
            }
            res.send(response)

        } catch (e) {
            res.send ( createErrorResponse(e))
        }


    }

    static async findOne(req,res) {
        try {

            const { user } = req

    
            const score = await scoreService.findOne({
                userId : user.id
            })

            const response = {
                success : true,
                data : {
                    score
                }
            }
            res.send(response)
            
        } catch ( e ) {
            res.send(createErrorResponse(e))
        }
    }


    static async update ( req, res ) {

        try {
            const {user} = req

            const result = await Joi.validate(req.body, {
                korean : Joi.object().required(),
                math : Joi.object().required(),
                english : Joi.object().required(),
                tamgu1 : Joi.object().required(),
                tamgu2 : Joi.object().required(),
                history : Joi.object().required(),
                foreign : Joi.object().optional(),
                line : Joi.string().required(),
                naesinScore : Joi.number(),
                naesinType : Joi.string()
            })
            
            const { korean , math , english , tamgu1, tamgu2 , history ,foreign, line, naesinScore, naesinType } = result 

            const modelObj = {
                userId : user.id,
                korean,
                math,
                english,
                tamgu1,
                tamgu2,
                history,
                foreign,
                line,
                naesinScore,
                naesinType
            }

            console.log(user.editTimes)
            const newUser = {
                editTimes : user.editTimes - 1,
                searchScore : (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile ) / 4
            }

            if ( user.editTimes <= 0 ) throw Error('EDIT_TIMES_NOT_FOUND')
            else await userService.update(user.id, newUser)

            const score = await scoreService.update(user.id, modelObj)

            if ( score == null ) throw Error('SCORE_NOT_FOUND')

            const response = {
                success : true,
                data : {
                    score
                }
            }

            res.send(response)


        } catch ( e ) {

            res.send( createErrorResponse(e))
        }



    }

    static async delete ( req, res ) {

        try {
            const { user } = req

            await scoreService.delete(user.id)

            const response = {
                success : true 
            }

            res.send(response)


        } catch ( e) {
            res.send(createErrorResponse(e))
        }


    }
}

