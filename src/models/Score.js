import Sequelize from 'sequelize'

export default class Score extends Sequelize.Model {


    static init(sequelize) {
        return super.init(
            {
                line: {
                    type : Sequelize.STRING,
                    allowNull : true 
                },
                korean : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                math : {
                    type : Sequelize.JSON,
                    allowNull : true 
                },
                english : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                tamgu1 : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                tamgu2 : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                history : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                foreign : {
                    type : Sequelize.JSON,
                    allowNull : true
                },
                naesin: {
                    type : Sequelize.FLOAT,
                    defaultValue : 3.0
                },
                gumjeong : {
                    type : Sequelize.FLOAT,
                    defaultValue : 0.0
                }, 
                naesin_type : {
                    type : Sequelize.STRING,
                    allowNull : true 
                },
                userId : {
                    type : Sequelize.INTEGER,
                    defaultValue : 0
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


    static associate(models) {

        this.belongsTo(models.User, {
            foreginKey: 'userId',
            as : 'user'
        })
    }



    toJSON() {
        const object = Object.assign({}, this.dataValues)
    
        // delete some (key, value)
     
        delete object.createdAt
        delete object.updatedAt

        delete object.userId

        
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
        user : {
            $ref: '#/components/schemas/User'
        },
        line : {
            type : 'string',
            example : '문과'
        },
        korean : {
            type : 'json',
            example : {
                "score" : 134,
                "grade": 1,
                "percentile" : 98
            }
        },
        math : {
            type : 'json',
            example : {
                "score" : 134,
                "grade": 1,
                "percentile" : 98,
                "type" : "가"
            }
        },
        english : {
            type : 'json',
            example : {
                "grade": 1
            }
        },
        tamgu1 : {
            type : 'json',
            example : {
                "score" : 86,
                "grade": 1,
                "percentile" : 98,
                "name" : "윤리와사상"
            }
        },
        tamgu2 : {
            type : 'json',
            example : {
                "score" : 86,
                "grade": 1,
                "percentile" : 98,
                "name" : "지구과학1"
            }
        },
        foreign : {
            type : 'json',
            example : {
                "score" : 86,
                "grade": 1,
                "percentile" : 98
            }
        },
        history : {
            type : 'json',
            example : {
                "grade": 1
            }
        },
        naesin : {
            type : 'float',
            example : 3.8
        },
        naesin_type : {
            type : 'sting',
            example : "국수영과"
        }
	},
	required: ['id','user']
}
