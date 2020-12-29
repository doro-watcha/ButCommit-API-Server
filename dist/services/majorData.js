"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;

class MajorDataService {
  constructor() {
    if (!instance) {
      console.log('Majfor Data Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.MajorData.create(modelObj);
  }

  async findOne(where) {
    return await _models.MajorData.findOne({
      where: JSON.parse(JSON.stringify(where)),
      include: {
        model: _models.Major,
        as: 'major'
      }
    });
  }

  async findList(where) {
    return await _models.MajorData.findAll({
      where: JSON.parse(JSON.stringify(where)),
      include: {
        model: _models.Major,
        as: 'major'
      }
    });
  }

  async findByFilter(options) {
    return Maj;
  }

  async findRecommendations(score) {
    const Op = _sequelize.default.Op;
    return await _models.MajorData.findAll({
      limit: 5,
      where: {
        recommendationScore: {
          [Op.and]: {
            [Op.lt]: score + 10,
            [Op.gt]: score - 10
          }
        }
      },
      include: {
        model: _models.Major,
        as: 'major'
      }
    });
  }

  async update(id, modelObj) {
    await _models.MajorData.update(modelObj, {
      where: {
        id
      }
    });
    const majorData = await _models.MajorData.findOne({
      where: {
        id
      }
    });
    if (majorData == null) throw Error('MAJOR_DATA_NOT_FOUND');
    return majorData;
  }

  async delete(id) {
    const majorData = await _models.MajorData.findOne({
      where: {
        id
      }
    });

    if (majorData == null) {
      throw Error('MAJOR_DATA_NOT_FOUND');
    } else {
      await majorData.destroy();
    }
  }

  async deleteAll() {
    return await _models.MajorData.destroy({
      where: {}
    });
  }

}

var _default = new MajorDataService();

exports.default = _default;