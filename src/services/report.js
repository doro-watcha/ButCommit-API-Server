import { Report , MajorData , User, Major ,Score, FinalReport} from '../models'
import { majorDataService , finalReportService } from './majorData'

let instance = null

class ReportService {

    constructor() {
		if (!instance) {
			console.log('Report Service 생성' + this)
			instance = this
		}
		return instance
    }
    
    async create ( modelObj) {
        const { userId , majorDataId } = modelObj

        const user = await User.findOne({
            where : { id : userId}
        })

        if ( user == null ) throw Error('USER_NOT_FOUND')

        const majorData = await MajorData.findOne({
            where : { id : majorDataId }
        })

        if ( majorData == null ) throw Error('MAJOR_DATA_NOT_FOUND')

        

        return await Report.create(modelObj)
    }

	async findOne(where) {
		return await Report.findOne({
            where: JSON.parse(JSON.stringify(where)),
            include: [
				{
					model: MajorData,
                    as: 'majorData',
                    include : 
                        {
                            model : Major,
                            as : 'major'
                        },
                        
                },
                    
                {
                    model : Score,
                    as : 'score'
                },
                
				{
					model: User,
                    as: 'user'
				},
			],
		})
	}

    async findList (userId) {


		let options = {
            where : { userId },
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
                },
                
				{
					model: User,
					as: 'user',
				},
			],
        }


        return await Report.findAll(options)
    }

    async findAll ( majorDataId) {

        return await Report.findAll ( {
            where : { majorDataId },
            include :[
                {
                    model: MajorData,
                    as : 'majorData',
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

    

    async update ( id , report) {

        await Report.update(report, {
            where: { id },
        })

        const updateReport = await Report.findOne({
            where: { id },
        })
        if (updateReport === null) throw Error('REPORT_NOT_FOUND')

        return updateReport

    }

    async delete ( id ) {

		const report = await Report.findOne({
			where: {
				id
			}
        })
        await FinalReport.destroy({
            where : { reportId : report.id}
          })

        if ( report == null ) {
            throw Error ('REPORT_NOT_FOUND')
        } else {
            await report.destroy()
        }
  }
}

export default new ReportService()