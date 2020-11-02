"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _functions = require("../utils/functions");

var _report = _interopRequireDefault(require("./report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class testController {
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

  static async downloadFile(req, res) {
    try {
      const file = '../excelfile/test.xlsx';

      const mimetype = _mime.default.getType(file);

      const filename = _path.default.basename(file);

      res.download(file, 'test.xlsx');
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async parse(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        societyUserId: _joi.default.number().required(),
        scienceUserId: _joi.default.number().required()
      });
      const {
        societyUserId,
        scienceUserId
      } = result;
      console.log("zxcvzxcvzxcvz");
      const path = '../excelfile/major.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 5563
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      console.log("zxcvzxcvzxvzxvzxzxcv");
      console.log(scienceUserId);
      console.log(societyUserId);
      const scienceScore = await _services.scoreService.findOne({
        userId: scienceUserId
      });
      console.log(scienceScore);
      const societyScore = await _services.scoreService.findOne({
        userId: societyUserId
      });
      if (scienceScore == null || soceityScore == null) throw Error('SCORE_NOT_FOUND');
      let data = [];
      await _services.testService.deleteAll(); // 파싱을 해보자 

      for (let i = 3; i < 5563; i++) {
        const majorData = await _services.majorDataService.findOne({
          id: i - 2
        });
        if (majorData == null) throw Error('MAJOR_DATA_NOT_FOUND');
        console.log(majorData.id);
        var value = -1;

        if (sheetData[i][0] == "인문") {
          console.log("퍽맨!");
          value = await _report.default.getScore(societyScore, majorData, false);
          console.log(value);
        } else {
          value = await _report.default.getScore(scienceScore, majorData, false);
        }

        const answer = parseFloat(sheetData[i][26]);
        console.log(answer);
        console.log(value);
        console.log("가즈아");
        var determinant = -1;
        console.log(answer);
        console.log(value);

        if (value - answer < 0 && answer - value > -3) {
          determinant = 0;
        }

        if (value - answer > 0 && value - answer < 3) {
          determinant = 1;
        }

        if (answer != null && determinant != -1) {
          let obj1 = {
            id: i - 2,
            line: sheetData[i][0],
            // 인문 
            group: sheetData[i][1],
            // 다 
            name: sheetData[i][3],
            // 대학명
            recruitmentType: sheetData[i][6],
            // 경찰행정학과
            major: sheetData[i][7],
            // 경찰행정학과
            sosokUniversity: sheetData[i][5],
            // 사회과학계열
            answer,
            test: value,
            result: determinant
          };
          data.push(obj1);
          console.log("가즈아2");
          await _services.testService.create(obj1);
        } else {
          let obj2 = {
            id: i - 2,
            line: sheetData[i][0],
            // 인문 
            group: sheetData[i][1],
            // 다 
            name: sheetData[i][2],
            // 대학명
            recruitmentType: sheetData[i][6],
            // 경찰행정학과
            major: sheetData[i][7],
            // 경찰행정학과
            sosokUniversity: sheetData[i][5],
            // 사회과학계열
            result: -1
          };
          await _services.testService.create(obj2);
        }
      }

      console.log("zxcvzxv");
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {}
  }

  static async getList(req, res) {
    try {
      const list = await _services.testService.findAll();
      const response = {
        success: true,
        data: {
          list
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async test(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        userId: _joi.default.number().required(),
        majorDataId: _joi.default.number().required()
      });
      const {
        userId,
        majorDataId
      } = result;
      const score = await _services.scoreService.findOne({
        userId
      });
      const majorData = await _services.majorDataService.findOne({
        id: majorDataId
      });
      const detail = await _report.default.getScore(score, majorData, true);
      const response = {
        success: true,
        data: {
          detail
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = testController;