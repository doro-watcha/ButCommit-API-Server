"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class ReportDataService {
  constructor() {
    if (!instance) {
      console.log('Report Data Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.ReportData.create(modelObj);
  }

  async findList(where) {
    return await _models.ReportData.findAll({
      where: JSON.parse(JSON.stringify(where)),
      include: [{
        model: _models.MajorData,
        as: 'majorData',
        include: [{
          model: _models.Major,
          as: 'major'
        }]
      }]
    });
  }

  async findOne(where) {
    return await _models.ReportData.findOne({
      where: JSON.parse(JSON.stringify(where)),
      include: [{
        model: _models.MajorData,
        as: 'majorData',
        include: [{
          model: _models.Major,
          as: 'major'
        }]
      }]
    });
  }

  async update(id, modelObj) {
    await _models.ReportData.update(modelObj, {
      where: {
        id
      }
    });
    const reportData = await _models.ReportData.findOne({
      where: {
        id
      }
    });
    if (reportData == null) throw Error('REPORT_DATA_NOT_FOUND');
    return reportData;
  }

  async deleteAll() {
    return await _models.ReportData.destroy({
      where: {}
    });
  }

}

var _default = new ReportDataService();

exports.default = _default;