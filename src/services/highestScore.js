import { HighestScore  } from  '../models'

let instance = null

class HighestScoreService {

    constructor() {
		if (!instance) {
			console.log('HighestScore Service 생성' + this)
			instance = this
		}
		return instance
  }

	async findOne(subject, type ) {
		return await HighestScore.findOne({
      where: {
        subject,
        type
      }
		})
	}
	
  async create ( modelObj ) {
    return await HighestScore.create(modelObj)
  }
  
}

export default new HighestScoreService()