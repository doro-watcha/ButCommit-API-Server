"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class FinalReportService {
  constructor() {
    if (!instance) {
      console.log('FinalReport Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.FinalReport.create(modelObj);
  }

  async findList(where) {
    return _models.FinalReport.findAll({
      where: JSON.parse(JSON.stringify(where)),
      attributes: ['id', 'group', 'userId', 'majorDataId', 'myRank', 'applicants'],
      include: {
        model: _models.Report,
        as: 'report'
      }
    });
  }

  async findOne(where) {
    return await _models.FinalReport.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async update(id, modelObj) {
    await _models.FinalReport.update(modelObj, {
      where: {
        id
      }
    });
    const updatedFinalReport = await _models.FinalReport.findOne({
      where: {
        id
      }
    });
    if (updatedFinalReport === null) throw Error('FINAL_REPORT_NOT_FOUND');
    return updatedFinalReport;
  }

  async delete(id) {
    const finalReport = await _models.FinalReport.findOne({
      where: {
        id
      }
    });

    if (finalReport == null) {
      throw Error('FINAL_REPORT_NOT_FOUND');
    } else {
      await finalReport.destroy();
    }
  }

}

var _default = new FinalReportService();

exports.default = _default;