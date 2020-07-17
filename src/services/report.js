import { Report , Major , User } from '../models'

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
        const { userId , majorId } = modelObj

        const user = await User.findOne({
            where : { id : userId}
        })

        if ( user == null ) throw Error('USER_NOT_FOUND')

        const major = await Major.findOne({
            where : { id : majorId }
        })

        if ( major == null ) throw Error('MAJOR_NOT_FOUND')

        return await Report.create(modelObj)
    }

	async findOne(where) {
		return await Report.findOne({
            where: JSON.parse(JSON.stringify(where)),
            include: [
				{
					model: Major,
					as: 'major',
                },
                
				{
					model: User,
					as: 'user',
				},
			],
		})
	}

    async findList (userId) {


		let options = {
            where : { userId },
            attributes : ['id','score'],
			include: [
				{
					model: Major,
					as: 'major',
                },
                
				{
					model: User,
					as: 'user',
				},
			],
        }


        return await Report.findAll(options)
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
        
        if ( report == null ) {
            throw Error ('REPORT_NOT_FOUND')
        } else {
            await report.destroy()
        }
  }
}

export default new ReportService()