"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserCommit extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      count: {
        type: _sequelize.default.INTEGER,
        allowNull: false
      },
      date: {
        type: _sequelize.default.STRING,
        allowNull: false
      }
    }, {
      sequelize
    });
  }

  static associate(models) {}

  toJSON() {
    const object = Object.assign({}, this.dataValues);
    return object;
  }

}

exports.default = UserCommit;
const schema = {
  type: 'object',
  properties: {
    count: {
      type: 'integer',
      example: '3'
    },
    date: {
      type: 'date',
      example: '2021-05-24'
    }
  }
};
exports.schema = schema;