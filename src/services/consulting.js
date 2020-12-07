import { Consulting , User, Redop } from  '../models'

let instance = null

class ConsultingService {

    constructor() {
		if (!instance) {
			console.log('Consulting Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ) {
    return await Consulting.create(modelObj)
  }

  async findList (where ) {
    return Consulting.findAll({
      where : JSON.parse(JSON.stringify(where)),
      include: [
        {
					model: User,
					as: 'user',
				},{
          model : Redop,
          as : 'redop'
        }
			]
    })
  }
	async findOne(where) {
		return await Consulting.findOne({
      where: JSON.parse(JSON.stringify(where)),
      include: [
        {
					model: User,
					as: 'user',
				},{
          model : Redop,
          as : 'redop'
        }
			]
		})
	}
  async update ( id, modelObj ) {
      await Consulting.update(modelObj, {
        where: { id },
    })

    const updatedConsulting = await Consulting.findOne({
        where: { id },
    })
    if (updatedConsulting === null) throw Error('CONSULTING_NOT_FOUND')

    return updatedConsulting 
  }

  async delete ( id ) {
    const consulting = await Consulting.findOne({
			where: {
				id
			}
        })
        
        if ( consulting == null ) {
            throw Error ('CONSULTING_NOT_FOUND')

        } else {

            await consulting.destroy()
        }
    }
  
}

export default new ConsultingService()
