import { GradeUniversity  } from  '../models'

let instance = null

class GradeUniversityService {

  constructor() {
    if (!instance) {
      console.log('GradeUniversity Service 생성' + this)
      instance = this
    }
    return instance
  }

  async findAll ( ) {
    return await GradeUniversity.findAll()
  }

}

export default new GradeUniversityService()
