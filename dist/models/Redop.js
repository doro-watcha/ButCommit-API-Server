"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Redop extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: _sequelize.default.STRING,
        allowNull: true
      }
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    }), this.belongsTo(models.Consulting, {
      foreignKey: 'consultingId',
      as: 'consulting'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues);
    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

}

exports.default = Redop;