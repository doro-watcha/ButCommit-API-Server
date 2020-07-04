"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Consulting extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      description: {
        type: _sequelize.default.STRING,
        allwoNull: true
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

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student'
    });
  }

} // swagger schema


exports.default = Consulting;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    score: {
      type: 'float',
      example: 725.3
    },
    userId: {
      type: 'integer',
      example: 3
    },
    university: {
      $ref: '#/components/schemas/University'
    },
    createdAt: {
      type: _sequelize.default.DATE,
      allowNull: false,
      defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: _sequelize.default.DATE,
      allowNull: false,
      defaultValue: _sequelize.default.literal('CURRENT_TIMESTAMP'),
      onUpdate: _sequelize.default.literal('CURRENT_TIMESTAMP')
    }
  }
};
exports.schema = schema;