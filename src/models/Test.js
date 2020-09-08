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
              total : {
                type : Sequelize.STRING,
                allowNull : true 
              },
              score : {
                type : Sequelize.STRING,
                allowNull : true
              },
              difference : {
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
      

        
        return object
      }
}
