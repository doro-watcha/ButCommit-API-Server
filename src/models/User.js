import Sequelize from 'sequelize'
import bycrypt from 'bcrypt'

export default class User extends Sequelize.Model {


    static init(sequelize) {
        return super.init (
            {
            name: {
							type: Sequelize.STRING,
							allowNull: false,
						},
						email: {
							type: Sequelize.STRING,
							allowNull: true,
						},
						telephone : {
							type : Sequelize.STRING,
							allowNull : true
						},
						password : {
							type : Sequelize.STRING,
							allowNull : false
						},
						haknyeon : {
							type : Sequelize.STRING,
							allowNull : true 
						},
						highSchool: {    
							type: Sequelize.STRING,
							allowNull : true,
						},
						line: {
							type: Sequelize.STRING,
							allwoNull: true,
						},
						gender : {
							type : Sequelize.STRING,
							allowNull : true
						},
						graduateYear: {
							type: Sequelize.INTEGER,
							defaultValue: -1,
						},
						predictTimes : {
							type : Sequelize.INTEGER,
							defaultValue : 0
						},
						adminLevel : {
							type : Sequelize.INTEGER,
							defaultValue : 0
						},
						searchScore : {
							type : Sequelize.FLOAT,
							allowNull : true
						},
						createdAt: {
							type: Sequelize.DATE,
							allowNull: false,
							defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
						},
						updatedAt: {
							type: Sequelize.DATE,
							allowNull: false,
							defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
							onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
						},
                

            },
            {
                sequelize,
            },
        )
		}
		
		static hashPassword(unencryptedPwd) {
			return bycrypt.hashSync(unencryptedPwd, 8)
		}

		isValidPassword(unencryptedPwd) {
			return bycrypt.compareSync(unencryptedPwd, this.password)
		}	

		static associate(models) {
			this.hasMany(models.Report, {
				foreignKey: 'userId',
				as: 'report'
			}),
			this.belongsTo(models.Academy, {
				foreignKey : 'academyId',
				as : 'academy'
			}),
			this.hasMany(models.Consulting, {
				foreignKey : 'userId',
				as : 'consulting'
			}),
			this.hasMany(models.PaymentRecord, {
				foreignKey : 'userId',
				as : 'paymenetRecord'
			}),
			this.hasMany(models.Score, {
				foreignKey : 'userId',
				as : 'score'
			})
			this.hasMany (models.FinalReport, {
				foreignKey : 'userId',
				as : 'finalReport'
			})
	
		}


toJSON() {
  const object = Object.assign({}, this.dataValues)

  // delete some (key, value)
 
  delete object.createdAt
	delete object.updatedAt
	delete object.password

	delete object.academyId

  
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
		name : {
			type : 'string',
			example : '안지영'
		},
		email : {
			type : 'string',
			example : 'Bol4@gmail.com'
		},
		telephone : {
			type : 'string',
			example : "010-7270-5880"
		},
		haknyeon : {
			type : 'string',
			example : '3학년'
		},
		password : {
			type : 'string',
			example : 'password'
		},
		highSchool : {
			type : 'string',
			example : '볼사고등학교'
		},
		line : {
			type : 'string',
			example : '문과'
		},
		gender : {
			type : 'string',
			example : '남'
		},
		graduateYear : {
			type : 'integer',
			example : '2013'
		},
		searchScore : {
			type : 'float',
			example : '96.3'
		},

		predictTimes : {
			type : 'integer',
			example : 3
		},
		academy : {
			$ref: '#/components/schemas/Academy'
		}
	},
	required : ['id', 'email','password','name']
}
