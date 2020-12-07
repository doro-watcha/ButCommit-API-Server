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
import MajorDataModel from './MajorData'
import TestModel from './Test'
import HighestScoreModel from './HighestScore'
import ScoreTransitionModel from './ScoreTransition'
import CommunityModel from './Community'
import NotificationModel from './Notification'
import FinalReportModel from './FinalReport'
import GradeUniversityModel from './GradeUniversity'
import NaesinModel from './Naesin'
import CommentModel from './Comment'
import AutoTransitionModel from './AutoTransition'
import RedopModel from './Redop'

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
  Academy : AcademyModel.init(sequelize, Sequelize),
  MajorData : MajorDataModel.init(sequelize, Sequelize),
  Test : TestModel.init(sequelize, Sequelize),
  HighestScore : HighestScoreModel.init(sequelize , Sequelize),
  ScoreTransition : ScoreTransitionModel.init(sequelize, Sequelize),
  Community : CommunityModel.init(sequelize,Sequelize),
  Notification : NotificationModel.init(sequelize,Sequelize),
  FinalReport : FinalReportModel.init(sequelize, Sequelize),
  GradeUniversity : GradeUniversityModel.init(sequelize, Sequelize),
  Naesin : NaesinModel.init(sequelize, Sequelize),
  Comment : CommentModel.init( sequelize, Sequelize),
  AutoTransition : AutoTransitionModel.init(sequelize, Sequelize),
  Redop : RedopModel.init(sequelize, Sequelize)

}

Object.values(models)
	.filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models))
  

module.exports = {
  ...models,
  sequelize,
  Sequelize
}