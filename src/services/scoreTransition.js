import { ScoreTransition } from '../models'

let instance = null

class ScoreTransitionService {

    constructor() {
		if (!instance) {
			console.log('Score Service 생성' + this)
			instance = this
		}
		return instance
    }

    async create(modelObj){

      return await ScoreTransition.create(modelObj)
    }
    async findOne(where) {
      return await ScoreTransition.findOne({
        where: JSON.parse(JSON.stringify(where))
      })
    }

    async deleteAll() {

      return await ScoreTransition.destroy({
        where : {}
      })
    }
      

}



export default new ScoreTransitionService()