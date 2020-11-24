import Sequelize from 'sequelize'

export default class Notification extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              title : {
                type : Sequelize.STRING,
                allowNull : true
              },
              body : {
                type : Sequelize.STRING,
                allowNull : true 
              }

            },{
              sequelize
            }
        )
      }

}

