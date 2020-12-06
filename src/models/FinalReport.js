import Sequelize from 'sequelize'

export default class FinalReport extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              group : {
                type : Sequelize.STRING,
                allowNull: true 
              },
              myRank : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              },
              applicants : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              }

            },{
              sequelize
            }
        )
      }



    static associate(models) {

      this.belongsTo(models.Report, {
        foreignKey : 'reportId',
        as : 'report'
      }),
      this.belongsTo(models.User, {
        foreignKey : 'userId',
        as : 'user'
      }),
      this.belongsTo(models.MajorData,{
        foreignKey : 'majorDataId',
        as : 'majorData'
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

