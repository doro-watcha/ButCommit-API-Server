"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AutoTransition extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      subject: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      originalScore: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      score: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      percentile: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      grade: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

}

exports.default = AutoTransition;