"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Product extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      amount: {
        type: _sequelize.default.INTEGER,
        allowNull: true
      },
      name: {
        type: _sequelize.default.STRING,
        allowNull: false
      }
    }, {
      sequelize
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues);
    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

}

exports.default = Product;