"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Commit extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      number: {
        type: _sequelize.default.INTEGER,
        allowNull: false
      },
      date: {
        type: _sequelize.default.STRING,
        allowNull: false
      }
    }, {
      sequelize
    });
  }

  static associate(models) {}

}

exports.default = Commit;