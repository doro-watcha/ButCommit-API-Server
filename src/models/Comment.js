import Sequelize from 'sequelize'

export default class Comment extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              content : {
                type : Sequelize.STRING,
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
