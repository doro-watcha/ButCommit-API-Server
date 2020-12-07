import { Redop } from  '../models'

let instance = null

class RedopService {

    constructor() {
		if (!instance) {
			console.log('Redop Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ){
    return Redop.create(modelObj)
  }


}

export default new RedopService()