import { FinalReport  } from  '../models'

let instance = null

class FinalReportService {

  constructor() {
    if (!instance) {
      console.log('FinalReport Service 생성' + this)
      instance = this
    }
    return instance
  }

  async create ( modelObj ) {
    return await FinalReport.create(modelObj)
  }

  async findList (where) {
      return FinalReport.findAll({
        where : JSON.parse(JSON.stringify(where))
    })
  }

  async findOne(where) {
    return await FinalReport.findOne({
      where: JSON.parse(JSON.stringify(where))
    })
  }

  async update ( id, modelObj ) {
      await FinalReport.update(modelObj, {
        where: { id },
    })

    const updatedFinalReport = await FinalReport.findOne({
        where: { id },
    })
    if (updatedFinalReport === null) throw Error('FINAL_REPORT_NOT_FOUND')

    return updatedFinalReport 
  }

  async delete ( id ) {
    const finalReport = await FinalReport.findOne({
			where: {
				id
			}
        })
        
        if ( finalReport == null ) {
            throw Error ('FINAL_REPORT_NOT_FOUND')

        } else {

            await finalReport.destroy()
        }
    }
}


export default new FinalReportService()
