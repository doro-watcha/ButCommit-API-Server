import Sequelize from 'sequelize'

export default class GradeCut extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              gradeCut : {
                type : Sequelize.JSON,
                allowNull : false 
              },
              year : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              type : {
                type : Sequelize.STRING,
                allownull : false
              }
            },
            {
              sequelize
            })
    }

}