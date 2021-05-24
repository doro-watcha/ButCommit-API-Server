import Sequelize from 'sequelize'
import dbConfig from '../config/db-config'

import UserCommitModel from './UserCommit'
import UserModel from './User'
import GroupModel from './Group'

const env = process.env.NODE_ENV || 'development'
const config = dbConfig[env]
const sequelize = new Sequelize(config.database, config.username, config.password, config)


const models = {
 UserCommit : UserCommitModel.init(sequelize, Sequelize),
 User : UserModel.init(sequelize, Sequelize),
 Group : GroupModel.init(sequelize, Sequelzie)


}

Object.values(models)
	.filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models))
  

module.exports = {
  ...models,
  sequelize,
  Sequelize
}