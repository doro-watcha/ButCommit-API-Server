import { Naesin } from  '../models'
import Sequelize from 'sequelize'
let instance = null

const Op = Sequelize.Op;

class NaesinService {

    constructor() {
		if (!instance) {
			console.log('Naesin Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create (modelObj) {
    return await Naesin.create(modelObj)
  }
  
	async findOne( univName, recruitmentType , recruitmentUnit, sosokUniversity, major, type, score) {


    const options = {
        where : {
          type,
          univName,
          recruitmentType,
          recruitmentUnit,
          sosokUniversity,
          major,
          startScore : {
            [Op.lte] : score
          },
          endScore : {
            [Op.gte] : score
          }
        }
      }


		return await Naesin.findOne(options)
  }

  async deleteAll ( ) {

    return await Naesin.destroy({
      where : {}
    })
  }
}


export default new NaesinService()