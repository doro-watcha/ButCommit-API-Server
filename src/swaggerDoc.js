import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

import { schema as Commit } from './models/UserCommit'

const ApiResponse = {
	type: 'object',
	properties: {
		success: {
			type: 'boolean',
			example: true,
		},
		data: {
			type: 'object',
		},
		ecode: {
			type: 'integer',
			example: 102,
		},
		message: {
			type: 'string',
			example: 'Invalid request',
		},
	},
	required: ['success'],
}

const Error = {
	type: 'object',
	properties: {
		success: {
			type: 'boolean',
			example: false,
		},
		ecode: {
			type: 'integer',
			example: 102,
		},
		message: {
			type: 'string',
			example: 'Invalid request',
		},
	},
	required: ['success', 'ecode', 'message'],
}

const parameters = {
	page: {
		name: 'page',
		in: 'query',
		description: 'default = 1, min = 1',
		schema: {
			type: 'integer',
		},
	},
	username : {
		name : 'username',
		in: 'query',
		description : 'github 유저명 ex) goddoro',
		shcema : {
			type : 'string'
		}
	},
	startDate : {
		name : 'startDate',
		in : 'query',
		description : '1일 1커밋 시작 날짜 ex) 2021-05-24',
		schema : {
			type : 'date'
		}
	}



}

const options = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'But Commit API',
			version: '2.0.0',
		},
		components: {
			schemas: {
				Commit
			},
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			parameters,
		},
	},
	basePath: '/',
	apis: ['./src/routes/*.js'],
}

const specs = swaggerJsDoc(options)

const uiOptions = {
	swaggerOptions: {
		supportedSubmitMethods: [],
	},
}

module.exports = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions))
}

