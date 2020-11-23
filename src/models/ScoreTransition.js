import Sequelize from 'sequelize'

export default class ScoreTransition extends Sequelize.Model {


  static init(sequelize) {
      return super.init(
          {

            univName : {
              type : Sequelize.STRING,
              allowNull : true
            },
            subject : {
              type : Sequelize.STRING,
              allowNull : true
            },
            major : {
              type : Sequelize.STRING,
              allowNull : true 
            },
            applicationIndicator : {
              type : Sequelize.STRING,
              allowNull : true 
            },
            score : {
              type : Sequelize.JSON,
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

          }, {
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

      