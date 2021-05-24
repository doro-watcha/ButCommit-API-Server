import Sequelize from 'sequelize'

export default class Group extends Sequelize.Model {


  static init(sequelize) {
      return super.init(
          {
            name : {
              type : Sequelize.STRING,
              allowNull : false
            }


          },{
            sequelize
          }
      )
    }


		toJSON() {
			const object = Object.assign({}, this.dataValues)

			
			return object
		}
    
  
    

}