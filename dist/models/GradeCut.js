"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GradeCut extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      gradeCut: {
        type: _sequelize.default.JSON,
        allowNull: false
      },
      year: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      },
      type: {
        type: _sequelize.default.STRING,
        allownull: false
      }
    }, {
      sequelize
    });
  }

}

exports.default = GradeCut;