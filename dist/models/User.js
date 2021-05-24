"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class User extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      username: {
        type: _sequelize.default.STRING,
        allowNull: false
      },
      fcmToken: {
        type: _sequelize.default.STRING,
        allowNull: false
      },
      isDoing: {
        type: _sequelize.default.BOOLEAN,
        defaultValue: true
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

exports.default = User;
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      example: 'goddoro'
    },
    fckToken: {
      type: 'string',
      example: 'asjkvnsaokdmvlkadmvaklas.dakfvanvamsdlvkamv'
    }
  }
};
exports.schema = schema;