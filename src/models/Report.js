import Sequelize from 'sequelize'

export default class Report extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              score : {
                type : Sequelize.JSON,
                allowNull : true
              },
              extraScore : {
                type : Sequelize.JSON,
                allowNull : true 
              },
              perfectScore : {
                type : Sequelize.JSON,
                allowNull : true,
              },
              actualPerfectScore : {
                type : Sequelize.INTEGER,
                allowNull : true 
              },
              recommendations : {
                type : Sequelize.JSON,
                allowNull : true
              },
              naesinScore : {
                type : Sequelize.FLOAT,
                defaultValue : 0.0
              },
              totalScore : {
                type : Sequelize.FLOAT,
                allowNull : true 
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
          as: 'user'
        }),
        this.belongsTo(models.MajorData, {
          foreignKey: 'majorDataId',
          as : 'majorData'
        }),
        this.hasMany(models.FinalReport, {
          foreignKey : 'reportId',
          as : 'finalReport'
        })
      }

      toJSON() {
        const object = Object.assign({}, this.dataValues)
      
        // delete some (key, value)
       
        delete object.createdAt
        delete object.updatedAt
        
        delete object.userId
        delete object.majorDataId
        delete object.majorId
    
        
        return object
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
    score : {
      type : 'json',
      example : {
        korean : 198.214,
        math : 219.643,
        english : 0,
        tamgu : 182.357,
        history : 0
      }
    },
    extraScore : {
      type : 'json',
      example : {
        korean : 0,
        math : 0,
        english : 0 ,
        tamgu : 0,
        history : 10
      }
    },
    perfectScore : {
      type : 'json',
      example : {
        korean : 357.1,
        math : 357.1,
        english : 0,
        tamgu : 285.7,
        history : 0
      }
    },
    user : {
      $ref: '#/components/schemas/User'
    },
    major : {
				$ref: '#/components/schemas/Major'
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  },
  required : ['id', 'score', 'user', 'major']
}
