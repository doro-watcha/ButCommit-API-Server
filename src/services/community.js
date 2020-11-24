import { Community  } from  '../models'

let instance = null

class CommunityService {

  constructor() {
    if (!instance) {
      console.log('Community Service 생성' + this)
      instance = this
    }
    return instance
  }

  async create ( modelObj ) {
    return await Community.create(modelObj)
  }

  async findList (where) {
      return Community.findAll({
        where : JSON.parse(JSON.stringify(where))
    })
  }

  async findOne(where) {
    return await Community.findOne({
      where: JSON.parse(JSON.stringify(where))
    })
  }

  async update ( id, modelObj ) {
      await Community.update(modelObj, {
        where: { id },
    })

    const updatedCommunity = await Community.findOne({
        where: { id },
    })
    if (updatedCommunity === null) throw Error('COMMUNITY_NOT_FOUND')

    return updatedCommunity 
  }

  async delete ( id ) {
    const community = await Community.findOne({
			where: {
				id
			}
        })
        
        if ( community == null ) {
            throw Error ('COMMUNITY_NOT_FOUND')

        } else {

            await community.destroy()
        }
    }
}


export default new CommunityService()
