import Sequelize from 'sequelize'

export default class Redop extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              content : {
                type : Sequelize.STRING,
                allowNull : true
              }
            },{
              sequelize
            })
          
    }

    static associate(models) {
        
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      }),
      this.belongsTo(models.Consulting, {
        foreignKey: 'consultingId',
        as : 'consulting'
      })

    }

    toJSON() {
      const object = Object.assign({}, this.dataValues)
    
      delete object.createdAt
      delete object.updatedAt

      return object
    }

}