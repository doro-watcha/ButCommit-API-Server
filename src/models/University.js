import Sequelize from 'sequelize'

export default class University extends Sequelize.Model {

	//연도, 계열, 모집군, 전형, 경쟁률, 최초 모집인원, 수시이월 인원, 최종 모집인원, 내신반영 유무, 특이사항, 비고


    static init(sequelize) {
        return super.init (
          {
						// 대학 이름 
						name : {
							type : Sequelize.STRING,
							allowNull : true
						},
						// 지원 가능 점수중 작은값
						min : {
							type : Sequelize.STRING,
							allowNull : true,
						},
						// 지원 가능 점수중 높은 값
						max : {
							type : Sequelize.STRING,
							allowNull : true
						},
						group : {
							type : Sequelize.STRING,
							allowNull : true 
						},
						location : {
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
		name : {
			type : 'string',
			example : '고려대'
		},
		group : {
			type : 'string',
			example : '가'
		},
		min : {
			type : 'float',
			example : '340'
		},
		max : {
			type : 'float',
			example : '660'
		},
		location : {
			type : 'string',
			example : '서울'
		},
		line : {
			type : 'string',
			example : '인문'
		}

	},
	required: ['id','name', 'min', 'max', 'location'],
}
