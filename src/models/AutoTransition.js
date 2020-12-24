import Sequelize from 'sequelize'

export default class AutoTransition extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              subject : {
                type : Sequelize.STRING,
                allowNull : true
              },
              score : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              percentile : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              grade : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              }
            },{
              sequelize
            })

          }

          toJSON() {
            const object = Object.assign({}, this.dataValues)
          
            // delete some (key, value)
           
            delete object.createdAt
            delete object.updatedAt
        
            
            return object
          }

}