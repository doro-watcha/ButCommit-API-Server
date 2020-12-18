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
      console.log('FInal Report Data Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.FinalReportData.create(modelObj);
  }

  async findList(where) {
    return await _models.FinalReportData.findAll({
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
    return await _models.FinalReportData.findOne({
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
    await _models.FinalReportData.update(modelObj, {
      where: {
        id
      }
    });
    const reportData = await _models.FinalReportData.findOne({
      where: {
        id
      }
    });
    if (reportData == null) throw Error('FINAL_REPORT_DATA_NOT_FOUND');
    return reportData;
  }

  async deleteAll() {
    return await _models.FinalReportData.destroy({
      where: {}
    });
  }

}

var _default = new ReportDataService();

exports.default = _default;