"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GradeUniversity extends _sequelize.default.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      group: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      applicationSubject: {
        type: _sequelize.default.STRING,
        allowNull: true
      },
      applicationWay: {
        type: _sequelize.default.STRING,
        allowNull: true
      }
    }, {
      sequelize
    });
  }

  toJSON() {
    const object = Object.assign({}, this.dataValues); // delete some (key, value)

    delete object.createdAt;
    delete object.updatedAt;
    return object;
  }

}

exports.default = GradeUniversity;