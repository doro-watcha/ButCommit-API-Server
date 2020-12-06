import { AutoTransition  } from  '../models'

let instance = null

class AutoTransitionService {

    constructor() {
		if (!instance) {
			console.log('AutoTraisition Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ) {
		return await AutoTransition.create(modelObj)
  }

  async findOne(where) {
    return await AutoTransition.findOne({
      where: JSON.parse(JSON.stringify(where))
    })
  }

  async deleteAll ( ) {

    return await AutoTransition.destroy({
      where : {}
    })
  }

}



export default new AutoTransitionService()
