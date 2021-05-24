import Sequelize from 'sequelize'

export default class Commit extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              number : {
                type : Sequelize.INTEGER,
                allowNull : false
              },
              date : {
                type : Sequelize.STRING,
                allowNull : false
            
              }

              
            },{
              sequelize
            }
        )
      }

      static associate(models) {

  
      }
  
    
}
