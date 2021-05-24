"use strict";

var _sequelize = _interopRequireDefault(require("sequelize"));

var _dbConfig = _interopRequireDefault(require("../config/db-config"));

var _UserCommit = _interopRequireDefault(require("./UserCommit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const env = process.env.NODE_ENV || 'development';
const config = _dbConfig.default[env];
const sequelize = new _sequelize.default(config.database, config.username, config.password, config);
const models = {
  UserCommit: _UserCommit.default.init(sequelize, _sequelize.default)
};
Object.values(models).filter(model => typeof model.associate === 'function').forEach(model => model.associate(models));
module.exports = { ...models,
  sequelize,
  Sequelize: _sequelize.default
};