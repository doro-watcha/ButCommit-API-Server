import { MajorData , Major} from  '../models'
import Sequelize from 'sequelize'
let instance = null

class MajorDataService {

    constructor() {
		if (!instance) {
			console.log('Majfor Data Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create (modelObj) {
    return await MajorData.create(modelObj)
  }
  
	async findOne(where) {

		return await MajorData.findOne({
      where: JSON.parse(JSON.stringify(where)),
      include : {
        model: Major,
					as: 'major',
      }
		})
	}

  async findList(where) {
		return await MajorData.findAll({
      where : JSON.parse(JSON.stringify(where)),
      include : {
        model: Major,
					as: 'major',
      }
		})
  }

  async findByFilter ( options ) {

    


    return Maj
  }
  
  async findRecommendations ( score ) {

    const Op = Sequelize.Op


    return await MajorData.findAll({
      limit : 5,
      where : {
        recommendationScore: {     
          [Op.and]: {
             [Op.lt]: (score+10),
             [Op.gt]: (score-10)
          }
        }
      },
      include : {
        model: Major,
          as: 'major',
      }
    })
  }
	
  async update (id , modelObj ) {

    await MajorData.update(modelObj,{
      where : { id }
    })

    const majorData = await MajorData.findOne({ where : {id}})

    if ( majorData == null ) throw Error('MAJOR_DATA_NOT_FOUND')

    return majorData
  }

  async delete ( id) {

    const majorData = await MajorData.findOne({
			where: {
				id
			}
        })
      
      if ( majorData == null ) {
          throw Error ('MAJOR_DATA_NOT_FOUND')
      } else {
          await majorData.destroy()
      }


  }

  async deleteAll ( ) {

    return await MajorData.destroy({
      where : {}
    })
  }
}


export default new MajorDataService()