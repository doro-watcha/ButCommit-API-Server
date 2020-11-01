import Sequelize from 'sequelize'

export default class HighestScore extends Sequelize.Model {


  static init(sequelize) {
      return super.init(
          {
            subject : {
              type : Sequelize.STRING,
              allowNull : true
            },
            type : {
              type : Sequelize.STRING,
              allownNull : true
            },
            score : {
              type : Sequelize.INTEGER,
              defaultValue : 0
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
          }
      )
    }

    toJSON() {
      const object = Object.assign({}, this.dataValues)
    
      // delete some (key, value)
     
      delete object.createdAt
      delete object.updatedAt
      
      return object
    }
    

  }