"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;
const Op = _sequelize.default.Op;

class NaesinService {
  constructor() {
    if (!instance) {
      console.log('Naesin Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.Naesin.create(modelObj);
  }

  async findOne(score, type, univName) {
    var options = {};

    if (type === "검정고시") {
      options = {
        where: {
          type,
          univName,
          startScore: {
            [Op.gte]: score
          },
          endScore: {
            [Op.lte]: score
          }
        }
      };
    } else if (type === "내신") {
      options = {
        where: {
          type,
          univName,
          startScore: {
            [Op.lte]: score
          },
          endScore: {
            [Op.gte]: score
          }
        }
      };
    }

    return await _models.Naesin.findOne(options);
  }

  async deleteAll() {
    return await _models.Naesin.destroy({
      where: {}
    });
  }

}

var _default = new NaesinService();

exports.default = _default;