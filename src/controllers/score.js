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
                foreign : Joi.object().required(),
                line : Joi.string().required(),
                naesin : Joi.number(),
                naesin_type : Joi.string(),
                gumjeong : Joi.number()
            })
            
            const { korean , math , english , tamgu1, tamgu2 , history ,foreign, line, naesin, naesin_type, gumjeong } = result 

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
                naesin,
                naesin_type,
                gumjeong
            }

            user.searchScore = (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile ) / 4

            await userService.update(user.id, user)

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
                foreign : Joi.object().required(),
                line : Joi.string().required(),
                naesin : Joi.number(),
                naesin_type : Joi.string(),
                gumjeong : Joi.number()
            })
            
            const { korean , math , english , tamgu1, tamgu2 , history ,foreign, line, naesin, naesin_type, gumjeong } = result 

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
                naesin,
                naesin_type,
                gumjeong
            }

            user.searchScore = (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile ) / 4

            await userService.update(user.id, user)

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

