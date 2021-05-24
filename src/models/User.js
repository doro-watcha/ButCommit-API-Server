import Sequelize from 'sequelize'

export default class User extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              username : {
                type : Sequelize.STRING,
                allowNull : false
              },
              fcmToken : {
                type : Sequelize.STRING,
                allowNull : false
              },
              isDoing : {
                type : Sequelize.BOOLEAN,
                defaultValue : true 
              }


            },{
              sequelize
            }
        )
      }

      static associate(models) {

  
      }


		toJSON() {
			const object = Object.assign({}, this.dataValues)

			
			return object
		}
    
  
    
}

export const schema = {
	type: 'object',
	properties: {
    username : {
      type : 'string',
      example :  'goddoro'
    },
    fckToken : {
      type : 'string',
      example : 'asjkvnsaokdmvlkadmvaklas.dakfvanvamsdlvkamv'
    }
	}
}