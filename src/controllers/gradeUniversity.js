import { gradeUniversityService } from '../services'
import Joi from '@hapi/joi'

import { createErrorResponse } from '../utils/functions'

export default class gradeUniversityController {

  static async findList (req, res ) {

    try {

      const gradeUniversities = await gradeUniversityService.findAll()

      const response = {
        success : true,
        data : {
          gradeUniversities
        }
      }

      res.send(response)
    
    
    } catch ( e ) {

      res.send(createErrorResponse(e))
    }
  }

}