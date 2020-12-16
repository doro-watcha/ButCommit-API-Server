"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class finalReportController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        reportId: _joi.default.number().required(),
        group: _joi.default.string().required()
      });
      const {
        user
      } = req;
      const {
        reportId,
        group
      } = result;
      const report = await _services.reportService.findOne({
        id: reportId
      });
      if (report == null) throw Error('REPORT_NOT_FOUND');
      const alreadyFinalReport = await _services.finalReportService.findOne({
        group,
        userId: user.id
      });
      if (alreadyFinalReport != null && group != "군외") throw Error('FINAL_REPORT_ALREADY_EXISTS');
      const modelObj = {
        group,
        reportId,
        userId: user.id,
        majorDataId: report.majorData.id
      }; // create final report

      await _services.finalReportService.create(modelObj); // create response

      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findList(req, res) {
    try {
      const {
        user
      } = req;
      const result = await _joi.default.validate(req.query, {
        userId: _joi.default.optional()
      });
      const {
        userId
      } = result;
      var id = 0;
      if (userId != null) id = userId;else if (user.id != null) id = user.id;
      console.log(userId);
      console.log(user.id);
      console.log(id);
      var finalReports = await _services.finalReportService.findList({
        userId: id
      });

      for (let i = 0; i < finalReports.length; i++) {
        var otherFinalReports = await _services.finalReportService.findList({
          majorDataId: finalReports[i].majorDataId
        });
        console.log(otherFinalReports.length);
        console.log(otherFinalReports[0].id);
        console.log(otherFinalReports[1].id);
        console.log(otherFinalReports[2].id);

        if (otherFinalReports.length > 1) {
          otherFinalReports.sort(function (a, b) {
            return b.report.totalScore - a.report.totalScore;
          });
        }

        const applicantsNumber = Object.keys(otherFinalReports).length;
        const myRank = otherFinalReports.findIndex(function (item, index) {
          return item.id == finalReports[i].id;
        }) + 1;
        finalReports[i].applicants = applicantsNumber;
        finalReports[i].myRank = myRank;
      }

      const response = {
        success: true,
        data: {
          finalReports
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findOne(req, res) {
    try {
      const id = req.params.id;
      const finalReport = await _services.finalReportService.findOne({
        id
      });
      if (finalReport == null) throw Error('FINAL_REPORT_NOT_FOUND');
      const response = {
        success: true,
        data: {
          finalReport
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      await _services.finalReportService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = finalReportController;