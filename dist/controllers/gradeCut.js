"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class gradeCutController {
  static async findOne(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        year: _joi.default.number().required(),
        type: _joi.default.string().required()
      });
      const {
        year,
        type
      } = result;
      const gradeCut = await _services.gradeCutService.findOne({
        year,
        type
      });
      const response = {
        success: true,
        data: {
          gradeCut
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async upload(req, res) {
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

  static async parse(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        year: _joi.default.number().required(),
        type: _joi.default.string().required()
      });
      const {
        year,
        type
      } = result;
      const path = '../excelfile/gradeCut.xlsx';
      await _services.gradeCutService.delete(year, type);

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 311
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      let gradeCut = {};
      let subjectCut = [];

      for (let i = 1; i < 311; i++) {
        console.log(sheetData[i][0]);
        let subject = sheetData[i][0];
        let beforeSubject = sheetData[i - 1][0];
        let obj = {
          grade: sheetData[i][1],
          originalScore: sheetData[i][2],
          score: sheetData[i][3],
          percentile: sheetData[i][4]
        };
        subjectCut.push(obj);

        if (sheetData[i][1] == '9') {
          gradeCut[beforeSubject] = subjectCut;
          subjectCut = [];
        }
      }

      const modelObj = {
        gradeCut,
        year,
        type
      };
      await _services.gradeCutService.create(modelObj);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = gradeCutController;