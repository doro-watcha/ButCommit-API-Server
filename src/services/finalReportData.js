import { FinalReportData, MajorData, Major} from '../models'

let instance = null

class ReportDataService {

    constructor() {
		if (!instance) {
			console.log('FInal Report Data Service 생성' + this)
			instance = this
		}
		return instance
    }
    
    async create ( modelObj) {
        return await FinalReportData.create(modelObj)
    }

    async findList(where) {
      return await FinalReportData.findAll({
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
      return await FinalReportData.findOne({
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

      await FinalReportData.update(modelObj,{
        where : { id }
      })
  
      const reportData = await FinalReportData.findOne({where : {id}})
  
      if ( reportData == null ) throw Error('FINAL_REPORT_DATA_NOT_FOUND')
  
      return reportData
  
    }


  async deleteAll ( ) {

    return await FinalReportData.destroy({
      where : {}
    })
  }

  }


export default new ReportDataService()