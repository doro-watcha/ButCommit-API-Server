import { UserCommit } from  '../models'

let instance = null

class CommitService {

    constructor() {
		if (!instance) {
			console.log('Commit Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ) {
    return await Commit.create(modelObj)
  }

}

export default new CommitService()