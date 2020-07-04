import Sequelize from 'sequelize'

export default class Consulting extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {

              title : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              description : {
                type : Sequelize.STRING,
                allwoNull : true
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
        foreignKey: 'studentId',
        as: 'student',
      })

    }
    
}



// swagger schema
export const schema = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
      example: 3,
    },
    title : {
      type : 'string',
      example :  '상답있어요'
    },
    description : {
      type : 'string',
      example : '대학가자~'
    },
    user : {
      $ref: '#/components/schemas/User'
    }
  },
  required : ['id','title','description','user']
}
