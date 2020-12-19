import Sequelize from 'sequelize'

export default class PaymentRecord extends Sequelize.Model {

// 금액, 날짜랑, 상품명 
    static init(sequelize) {
        return super.init(
            {
              orderNunber : {
                type : Sequelize.STRING,
                allowNull : false
              },
              amount : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              product : {
                type : Sequelize.STRING,
                allowNUll : false
              },
              status : {
                type : Sequelize.STRING,
                allowNull : false
              },
              createdAt: {
                  type: Sequelize.DATE,
                  allowNull: true,
                  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              },
              updatedAt: {
                  type: Sequelize.DATE,
                  allowNull: true,
                  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                  onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
              },
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
