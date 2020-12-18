import { ReportData ,MajorData,Major} from '../models'

let instance = null

class ReportDataService {

    constructor() {
		if (!instance) {
			console.log('Report Data Service 생성' + this)
			instance = this
		}
		return instance
    }
    
    async create ( modelObj) {
        return await ReportData.create(modelObj)
    }

    async findList(where) {
      return await ReportData.findAll({
        where : JSON.parse(JSON.stringify(where)),
        include: [
          {
              model: MajorData,
              as: 'majorData',
              include : [
                  {
                      model : Major,
                      as : 'major'
                  }
              ]
          }
        ]
      })
    }

    async findOne (where ) {
      return await ReportData.findOne({
        where : JSON.parse(JSON.stringify(where)),
        include: [
          {
              model: MajorData,
              as: 'majorData',
              include : [
                  {
                      model : Major,
                      as : 'major'
                  }
              ]
          }
        ]
      })

    }

    async update ( id, modelObj ) {

      await ReportData.update(modelObj,{
        where : { id }
      })
  
      const reportData = await ReportData.findOne({
        where : { id }
      })
  
      if ( reportData == null ) throw Error('REPORT_DATA_NOT_FOUND')
  
      return reportData
  
    }


    async deleteAll ( ) {

      return await ReportData.destroy({
        where : {}
      })
    }
  }


export default new ReportDataService()