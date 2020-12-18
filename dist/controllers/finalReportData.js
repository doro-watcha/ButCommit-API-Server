"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _services = require("../services");

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class finalReportDataController {
  static async create(req, res) {
    try {
      await _services.finalReportDataService.deleteAll();

      for (let i = 0; i < 3521; i++) {
        let majorData = await _services.majorDataService.findOne({
          id: i + 1
        });
        let modelObj = {
          id: i + 1,
          majorDataId: majorData.id
        };
        await _services.finalReportDataService.create(modelObj);
      }

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
      const finalReportDataList = await _services.finalReportDataService.findList({});
      const response = {
        success: true,
        data: finalReportDataList
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findOne(req, res) {
    try {
      const id = req.params.id;
      const finalReportData = await _services.finalReportDataService.findOne({
        id
      });
      const response = {
        success: true,
        data: finalReportData
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const result = await _joi.default.validate(req.body, {
        applicants: _joi.default.number().required()
      });
      const {
        applicants
      } = result;
      const modelObj = {
        applicants
      };
      const finalReportData = await _services.finalReportDataService.update(id, modelObj);
      const response = {
        success: true,
        data: finalReportData
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = finalReportDataController;