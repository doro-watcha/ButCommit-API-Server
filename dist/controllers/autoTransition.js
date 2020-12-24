"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _services = require("../services");

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class fileController {
  static async uploadFile(req, res) {
    try {
      const files = await _joi.default.validate(req.files, {
        excel: _joi.default.array().min(1).required()
      });
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async parseFile(req, res) {
    try {
      await _services.autoTransitionService.deleteAll();
      const path = '../excelfile/autoTransition.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 1283
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      let obj = {};

      for (let i = 1; i < 1283; i++) {
        if (sheetData[i][0] == "영어" || sheetData[i][0] == "한국사") {
          obj = {
            id: i,
            subject: sheetData[i][0],
            grade: sheetData[i][3]
          };
        } else {
          obj = {
            id: i,
            subject: sheetData[i][0],
            score: sheetData[i][1],
            percentile: sheetData[i][2],
            grade: sheetData[i][3]
          };
        }

        await _services.autoTransitionService.create(obj);
      }

      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findOne(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        subject: _joi.default.string().required(),
        score: _joi.default.number().required()
      });
      const {
        subject,
        score
      } = result;
      const autoTransition = await _services.autoTransitionService.findOne({
        subject,
        score
      });
      if (autoTransition == null) throw Error('AUTO_TRANSITION_NOT_FOUND');
      const response = {
        success: true,
        data: {
          autoTransition
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = fileController;