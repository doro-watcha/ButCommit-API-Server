import { Major } from  '../models'

let instance = null

class MajorService {

    constructor() {
		if (!instance) {
			console.log('Majfor Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ) {
    return await Major.create(modelObj)
  }

	async findList(where) {
		return await Major.findAll({
			where : JSON.parse(JSON.stringify(where))
		})
	}

	async findOne(where) {
		return await Major.findOne({
			where: JSON.parse(JSON.stringify(where))
		})
	}

  async update ( id, modelObj ) {

    return await Major.update(modelObj, {
      where: { id }
    })

  }

  async delete ( id ) {
    const major = await Major.findOne({
			where: {
				id
			}
        })
        
        if ( major == null ) {
            throw Error ('MAJOR_NOT_FOUND')

        } else {

            await major.destroy()
        }
    }
  
}

export default new MajorService()