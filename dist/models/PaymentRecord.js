"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PaymentRecord extends _sequelize.default.Model {
  // 금액, 날짜랑, 상품명 
  static init(sequelize) {
    return super.init({
      orderNunber: {
        type: _sequelize.default.STRING,
        allowNull: false
      },
      amount: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      product: {
        type: _sequelize.default.STRING,
        allowNUll: false
      },
      status: {
        type: _sequelize.default.STRING,
        allowNull: false
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
    delete object.userId;
    return object;
  }

} // swagger schema


exports.default = PaymentRecord;
const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 3
    },
    amount: {
      type: 'integer',
      example: 97000
    },
    predictTimes: {
      type: 'integer',
      example: 5
    },
    user: {
      $ref: '#/components/schemas/User'
    }
  },
  required: ['id', 'amount', 'predictTimes', 'user']
};
exports.schema = schema;