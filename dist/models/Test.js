"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Test extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      line: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      group: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      name: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      recruitmentType: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      major: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      total: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      score: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      difference: {
        type: _sequelize.default.FLOAT,
        alloNull: true
      },
      result: {
        type: _sequelize.default.INTEGER,
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
    const object = Object.assign({}, this.dataValues);
    return object;
  }

}

exports.default = Test;