import Sequelize from 'sequelize'

export default class Naesin extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              startScore : {
                type : Sequelize.FLOAT,
                defaultValue : 0.0
              },
              endScore : {
                type : Sequelize.FLOAT,
                defaultValue: 0.0
              },
              value : {
                type : Sequelize.FLOAT,
                defaultValue : 0.0
              },
              univName : {
                type : Sequelize.STRING,
                allowNull : true
              },
              type : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              major : {
                type : Sequelize.STRING,
                allowNull : true
              },
              sosokUniversity : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              recruitmentUnit : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              recruitmentType : {
                type : Sequelize.STRING,
                allowNull : true
              },
              applicationIndicator : {
                type : Sequelize.STRING,
                allowNull : true 
              }

            }, {
              sequelize
            }
        )}

        toJSON() {
          const object = Object.assign({}, this.dataValues)
        
          // delete some (key, value)
         
          delete object.createdAt
          delete object.updatedAt
          
          return object
        }
        
}