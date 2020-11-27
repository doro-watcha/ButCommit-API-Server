import Sequelize from 'sequelize'

export default class Naesin extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              year : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
            }, {
              sequelize
            }
        )}
}