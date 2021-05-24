import Sequelize from 'sequelize'
import dbConfig from '../config/db-config'

// import CommitModel from './Commit'

const env = process.env.NODE_ENV || 'development'
const config = dbConfig[env]
const sequelize = new Sequelize(config.database, config.username, config.password, config)


const models = {
 // Commit : CommitModel.init(sequelize, Sequelize),


}

Object.values(models)
	.filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models))
  

module.exports = {
  ...models,
  sequelize,
  Sequelize
}