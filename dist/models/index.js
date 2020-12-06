"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

var _dbConfig = _interopRequireDefault(require("../config/db-config"));

var _University = _interopRequireDefault(require("./University"));

var _Score = _interopRequireDefault(require("./Score"));

var _User = _interopRequireDefault(require("./User"));

var _PaymentRecord = _interopRequireDefault(require("./PaymentRecord"));

var _Report = _interopRequireDefault(require("./Report"));

var _Major = _interopRequireDefault(require("./Major"));

var _Consulting = _interopRequireDefault(require("./Consulting"));

var _Academy = _interopRequireDefault(require("./Academy"));

var _MajorData = _interopRequireDefault(require("./MajorData"));

var _Test = _interopRequireDefault(require("./Test"));

var _HighestScore = _interopRequireDefault(require("./HighestScore"));

var _ScoreTransition = _interopRequireDefault(require("./ScoreTransition"));

var _Community = _interopRequireDefault(require("./Community"));

var _Notification = _interopRequireDefault(require("./Notification"));

var _FinalReport = _interopRequireDefault(require("./FinalReport"));

var _GradeUniversity = _interopRequireDefault(require("./GradeUniversity"));

var _Naesin = _interopRequireDefault(require("./Naesin"));

var _Comment = _interopRequireDefault(require("./Comment"));

var _AutoTransition = _interopRequireDefault(require("./AutoTransition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const env = process.env.NODE_ENV || 'development';
const config = _dbConfig.default[env];
const sequelize = new _sequelize.default(config.database, config.username, config.password, config);
const models = {
  University: _University.default.init(sequelize, _sequelize.default),
  Score: _Score.default.init(sequelize, _sequelize.default),
  User: _User.default.init(sequelize, _sequelize.default),
  PaymentRecord: _PaymentRecord.default.init(sequelize, _sequelize.default),
  Report: _Report.default.init(sequelize, _sequelize.default),
  Major: _Major.default.init(sequelize, _sequelize.default),
  Consulting: _Consulting.default.init(sequelize, _sequelize.default),
  Academy: _Academy.default.init(sequelize, _sequelize.default),
  MajorData: _MajorData.default.init(sequelize, _sequelize.default),
  Test: _Test.default.init(sequelize, _sequelize.default),
  HighestScore: _HighestScore.default.init(sequelize, _sequelize.default),
  ScoreTransition: _ScoreTransition.default.init(sequelize, _sequelize.default),
  Community: _Community.default.init(sequelize, _sequelize.default),
  Notification: _Notification.default.init(sequelize, _sequelize.default),
  FinalReport: _FinalReport.default.init(sequelize, _sequelize.default),
  GradeUniversity: _GradeUniversity.default.init(sequelize, _sequelize.default),
  Naesin: _Naesin.default.init(sequelize, _sequelize.default),
  Comment: _Comment.default.init(sequelize, _sequelize.default),
  AutoTransition: _AutoTransition.default.init(sequelize, _sequelize.default)
};
Object.values(models).filter(model => typeof model.associate === 'function').forEach(model => model.associate(models));
module.exports = { ...models,
  sequelize,
  Sequelize: _sequelize.default
};