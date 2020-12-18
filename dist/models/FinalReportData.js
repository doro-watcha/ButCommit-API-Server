"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FinalReportData extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      applicants: {
        type: _sequelize.default.INTEGER,
        defaultValue: 0
      }
    }, {
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.MajorData, {
      foreignKey: 'majorDataId',
      as: 'majorData'
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    delete object.majorDataId;
    return object;
  }

}

exports.default = FinalReportData;