import { universityService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class UniversityController {

    static async create ( req, res) {

        try { 

            /**
             * type은 필터 조건인데 location 이라고 하면 지역별, 
             */
            const result = await Joi.validate(req.body , {
                name : Joi.string(),
                min : Joi.number(),
                max : Joi.number(),
                line : Joi.string(),
                location : Joi.string(),
                group : Joi.string(),
                type : Joi.string()
            })

            const { name , min , max , location, group, line, type  } = result 

            const exist_university = await universityService.findOne({name})
            
            if ( exist_university != null) throw Error('UNIVERSITY_ALREADY_EXISTS')

            const modelObj = {
                name,
                min,
                max,
                location,
                group,
                line,type 
            }

            const university = await universityService.create(modelObj)

            const response = {

                success : true,
                data : {
                    university 
                }
            }
            
            res.send(response)
        } catch ( e ) {
            res.send(createErrorResponse(e))
        }

    }



    static async findList( req, res) {

        try {

            const result = await Joi.validate(req.query , {
                name : Joi.string(),
                min : Joi.number(),
                max : Joi.number(),
                type : Joi.string(),
                location : Joi.string(),
                group : Joi.string(),
                line : Joi.string()
            })

            const { name , min , max , location, group , line, type } = result 

            const modelObj = {
                name,
                min,
                max,
                type,
                location,
                group,
                line
            }

            const university = await universityService.findList(modelObj)

            if ( university == null ) throw Error('UNIVERSITY NOT FOUND')

            const response = {

                success : true,
                data : {
                    university
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

            const university = await universityService.findOne({id})

            if ( university == null ) throw Error('UNIVERSITY_NOT_FOUND')

            const response = {
                success : true ,
                data : {
                    university
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

                name : Joi.string(),
                max : Joi.number(),
                min : Joi.number(),
                location : Joi.string(), 
                group : Joi.string(),
                line : Joi.string()
            })

            const { name , max , min , location, group ,line} = result

            const modelObj = {
                name,
                max,
                min,
                location,
                group,
                line
            }

           
            await universityService.update( id , modelObj) 

            const response = {
                success : true
            }

            res.send(response)
        } catch ( e ) {
            res.send(createErrorResponse(e))
        }

    }

    static async delete ( req, res ) {

        try { 

            const id = req.params.id

            await universityService.delete(id)

            const response = {
                success : true 
            }
            res.send(response)
        } catch ( e ) {
            res.send(createErrorResponse(e))
        }



    }
}