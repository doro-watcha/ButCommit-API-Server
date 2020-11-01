import Sequelize from 'sequelize'

export default class Major extends Sequelize.Model {

  static init(sequelize) {
    return super.init (
      {
        // 계열
        line: {
          type: Sequelize.STRING,
          allowNull : true,
        },
        // 군별
        group: {
          type: Sequelize.STRING,
          allowNull : true,
        },
        // 위치
        location : {
          type : Sequelize.STRING,
          allowNull : true 
        },
        // 모집 전형
        recruitmentType : {
          type : Sequelize.STRING,
          allowNull : true
        },
        // 대학 이름
        univName : {
          type : Sequelize.STRING,
          allowNull : true
        },
        sosokUniversity : {
          type : Sequelize.STRING,
          allowNull : true 
        },
        //모집 단위
        recruitmentUnit : {
          type : Sequelize.STRING,
          allowNull : true 
        },
        
        //세부 전공
        majorName : {
          type : Sequelize.STRING,
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
            sequelize,
        },
    )
}


static associate(models) {
  this.hasMany(models.MajorData, {
    foreignKey: 'majorId',
    as: 'majorData',
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

// swagger schema
export const schema = {
type: 'object',
  properties: {
  id: {
    type: 'integer',
    example: 3,
  },
  line : {
    type: 'string',
    example : '인문'
  },
  group : {
    type : 'string',
    example : '가나'
  },
  location : {
    type : 'string',
    example : '충남'
  },
  recruitmentType : {
    type : 'string',
    example : '일반전형'
  },
  univName : {
    type : 'string',
    example : '고려대'
  },
  recruitmentUnit : {
    type : 'string',
    example : '자율전공'
  },
  majorName : {
    type : 'string',
    example : '자율전공학부'
  }

},
required: ['id', 'name', 'univ'],
}
