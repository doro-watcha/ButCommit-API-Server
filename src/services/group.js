import { Group } from  '../models'

let instance = null

class GroupService {

    constructor() {
		if (!instance) {
			console.log('Group Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( group ) {

  
  }


}

export default new GroupService()