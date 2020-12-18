import Sequelize from 'sequelize'

export default class ReportData extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
              applicants : {
                type : Sequelize.INTEGER,
                defaultValue : 0
              }
            },
            {
              sequelize
            })
          
          
    }

    static associate(models) {
        
      this.belongsTo(models.MajorData, {
        foreignKey: 'majorDataId',
        as: 'majorData'
      })
    }

    toJSON() {
      const object = Object.assign({}, this.dataValues)
    
      // delete some (key, value)
     
      delete object.createdAt
      delete object.updatedAt
      delete object.majorDataId
      
      return object
    }

}

          