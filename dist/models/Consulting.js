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
      isAdmin: {
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

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    return object;
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
    title: {
      type: 'string',
      example: '상답있어요'
    },
    description: {
      type: 'string',
      example: '대학가자~'
    },
    user: {
      $ref: '#/components/schemas/User'
    }
  },
  required: ['id', 'title', 'description', 'user']
};
exports.schema = schema;