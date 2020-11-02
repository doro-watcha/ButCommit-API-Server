import Sequelize from 'sequelize'

export default class Test extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              line : {
                type : Sequelize.STRING,
                allowNull : true
              },
              group : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              name : {
                type : Sequelize.STRING,
                allowNull : true,
              },
              recruitmentType : {
                type : Sequelize.STRING,
                allowNull : true
              },
              major : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              answer : {
                type : Sequelize.FLOAT,
                allowNull : true 
              },
              sosokUniversity : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              perfectScore : {
                type : Sequelize.INTEGER,
                allowNull : true 
              },
              test : {
                type : Sequelize.FLOAT,
                alloNull : true 
              },
              result : {
                type : Sequelize.INTEGER,
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
            },
            {

                sequelize
            },

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
