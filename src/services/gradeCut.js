import { GradeCut  } from  '../models'

let instance = null

class GradeCutService {

  constructor() {
    if (!instance) {
      console.log('Grade Cut Service 생성' + this)
      instance = this
    }
    return instance
  }

  async create ( modelObj ) {
    return await GradeCut.create(modelObj)
  }


	async findOne(where) {
		return await GradeCut.findOne({
			where: JSON.parse(JSON.stringify(where))
		})
  }

	async delete ( year,type ) {
		const gradeCut = await GradeCut.findOne({
			where: {
				year, type
			}
        })


      if ( gradeCut != null) await gradeCut.destroy()
     
	}

}

export default new GradeCutService()
