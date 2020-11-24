import Sequelize from 'sequelize'

export default class Community extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              title : {
                type : Sequelize.STRING,
                allowNull : true
              },
              body: {
                type : Sequelize.STRING,
                allowNull : true
              }

            },{
              sequelize
            }
        )
      }



    static associate(models) {

      this.belongsTo(models.User, {
        foreignKey : 'userId',
        as : 'user'
      })

    }


}

