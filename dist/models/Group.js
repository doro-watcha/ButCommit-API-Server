"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Group extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
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
    return object;
  }

}

exports.default = Group;