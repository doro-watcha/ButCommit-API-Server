"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScoreTransition extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      univName: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      subject: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      major: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      line: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      applicationIndicator: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      score: {
        type: _sequelize.default.JSON,
        allowNull: true
      },
      createdAt: {
        type: _sequelize.default.DATE,
        allowNull: true,
        defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: _sequelize.default.DATE,
        allowNull: true,
        defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP'),
        onUpdate: _sequelize.default.literal('CURRENT_TIMESTAMP')
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

exports.default = ScoreTransition;