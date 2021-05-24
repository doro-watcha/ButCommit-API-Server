import Sequelize from 'sequelize'

export default class Commit extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              count : {
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

export const schema = {
	type: 'object',
	properties: {
    count : {
      type : 'integer',
      example :  '3'
    },
    date : {
      type : 'date',
      example : '2021-05-24'
    }
	}
}