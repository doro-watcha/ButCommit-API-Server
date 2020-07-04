import Sequelize from 'sequelize'
import dbConfig from '../config/db-config'

import UniversityModel from './University'
import ScoreModel from './Score'
import UserModel from './User'
import PaymentRecordModel from './PaymentRecord'
import ReportModel from './Report'
import MajorModel from './Major'
import ConsultingModel from './Consulting'
import AcademyModel from './Academy'

const env = process.env.NODE_ENV || 'development'
const config = dbConfig[env]
const sequelize = new Sequelize(config.database, config.username, config.password, config)


const models = {
  University : UniversityModel.init(sequelize, Sequelize),
  Score : ScoreModel.init(sequelize, Sequelize),
  User : UserModel.init(sequelize, Sequelize),
  PaymentRecord : PaymentRecordModel.init(sequelize , Sequelize),
  Report : ReportModel.init(sequelize, Sequelize),
  Major : MajorModel.init(sequelize , Sequelize),
  Consulting : ConsultingModel.init(sequelize, Sequelize),
  Academy : AcademyModel.init(sequelize, Sequelize)
}

Object.values(models)
	.filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models))
  

module.exports = {
  ...models,
  sequelize,
  Sequelize
}