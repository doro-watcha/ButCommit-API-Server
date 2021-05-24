// import { commitService } from '../services'
import Joi from '@hapi/joi'
import axios from 'axios'
import cheerio from 'cheerio'

import { createErrorResponse } from '../utils/functions'


export default class commitController {

  static async crawl (req, res ) {

    try {

      const result = await Joi.validate(req.query, {
        username : Joi.string().required(),
        startDate : Joi.date().required()
      })

      const { username , startDate } = result 


      const commits = []
      const html = await axios.get("https://github.com/" + username).catch ( function (error){
        if ( error.response.status == 404) {
          throw Error('USER_NOT_FOUND')
        }
      })
      const $ = cheerio.load(html.data)
      $('.ContributionCalendar-day').each ( function (index,element){

        const date = element.attribs['data-date']
        const _date = new Date(date)
        if ( date != undefined && _date >= startDate ) {

          commits.push({ 
            count : parseInt(element.attribs['data-count']),
            date
          })

        }

      })

      commits.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a>b ? -1 : a<b ? 1 : 0;
      });

      const response = {
        success :true,
        data : {
          commits
        }
      }

      res.send(response)


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }
  

  static async check ( req, res) {

    try {

      const result = await Joi.validate(req.query, {
        username : Joi.string().required()
      })

      const { username } = result

      await axios.get("https://github.com/" + username).catch ( function (error){
        if ( error.response.status == 404) {
          throw Error('USER_NOT_FOUND')
        } 
      })

      res.send({ success : true})


    } catch ( e ) {
      res.send(createErrorResponse(e))
    }
  }


    

}
