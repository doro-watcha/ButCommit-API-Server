"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Naesin extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      startScore: {
        type: _sequelize.default.FLOAT,
        defaultValue: 0.0
      },
      endScore: {
        type: _sequelize.default.FLOAT,
        defaultValue: 0.0
      },
      value: {
        type: _sequelize.default.FLOAT,
        defaultValue: 0.0
      },
      univName: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      type: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      major: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      sosokUniversity: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      recruitmentUnit: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      recruitmentType: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      applicationIndicator: {
        type: _sequelize.default.STRING,
        allowNull: true
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

exports.default = Naesin;