import Sequelize from 'sequelize'

export default class PaymentRecord extends Sequelize.Model {

// 금액, 날짜랑, 상품명 
    static init(sequelize) {
        return super.init(
            {
              merchant_uid : {
                type : Sequelize.STRING,
                allowNull : false
              },
              amount : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              name : {
                type : Sequelize.STRING,
                allowNUll : false
              },
              imp_uid : {
                type : Sequelize.STRING,
                allowNull : false
              }
            },
            {

                sequelize
            },

        )
    }

    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      })
    }

		toJSON() {
			const object = Object.assign({}, this.dataValues)
		
			// delete some (key, value)
		 
			delete object.createdAt
      delete object.updatedAt
      
      delete object.userId
      delete object.imp_uid
	
			
			return object
		}
    
}




// swagger schema
export const schema = {
	type: 'object',
	properties: {
		id: {
			type : 'integer',
			example : 3,
    },
    amount : {
      type : 'integer',
      example : 97000
    },
    predictTimes : {
      type : 'integer',
      example : 5
    },
    user : {
      $ref: '#/components/schemas/User'
    }


  },

	required: ['id', 'amount', 'predictTimes','user'],
}
