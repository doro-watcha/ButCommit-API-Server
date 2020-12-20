import Sequelize from 'sequelize'

export default class Product extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              amount : {
                type : Sequelize.INTEGER,
                allowNull : true
              },
              name : {
                type : Sequelize.STRING,
                allowNull : false
              }
            },{
              sequelize
            })
          
    }

    toJSON() {
      const object = Object.assign({}, this.dataValues)
    
      delete object.createdAt
      delete object.updatedAt

      return object
    }


  }
