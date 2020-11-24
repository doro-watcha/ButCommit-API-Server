import Sequelize from 'sequelize'

export default class FinalReport extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              group : {
                type : Sequelize.STRING,
                allowNull: true 
              },

            },{
              sequelize
            }
        )
      }



    static associate(models) {

      this.belongsTo(models.Report, {
        foreignKey : 'reportId',
        as : 'report'
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

