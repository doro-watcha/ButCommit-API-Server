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
      const path = '../excelfile/test.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 5520
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      const scienceScore = await _services.scoreService.findOne({
        userId: scienceUserId
      });
      const societyScore = await _services.scoreService.findOne({
        userId: societyUserId
      });
      if (scienceScore == null || societyScore == null) throw Error('SCORE_NOT_FOUND');
      let data = [];
      await _services.testService.deleteAll();
      var pass = 0; // 파싱을 해보자 

      for (let i = 2539; i < 2540; i++) {
        const majorData = await _services.majorDataService.findOne({
          id: i - 2
        });
        if (majorData == null) throw Error('MAJOR_DATA_NOT_FOUND');
        console.log("majorDataId야 " + majorData.id);
        let societyAnswer = parseFloat(sheetData[i][10]);
        let scienceAnswer = parseFloat(sheetData[i][12]);
        console.log(majorData.major.univName);
        console.log(majorData.major.majorName);
        console.log(sheetData[i][10]);
        console.log(sheetData[i][12]);
        let societyValue = -1;
        let scienceValue = -1;
        /**
         * 문과 예측 점수 구하기 
         */

        if (isNaN(societyAnswer)) societyAnswer = -1;else societyValue = await _report.default.getScore(societyScore, majorData, false);
        /**
         * 이과 예측 점수 구하기
         */

        if (isNaN(scienceAnswer)) scienceAnswer = -1;else scienceValue = await _report.default.getScore(scienceScore, majorData, false);
        var societyDeterminant = -1;
        var scienceDeterminant = -1;
        /**
         * answer이 둘 다 NAN이니깐 data가 없는거임
         */

        if (societyAnswer == -1 && scienceAnswer == -1) societyDeterminant = 2;
        /**
         * 문과 점수 판단하기
         */

        if (societyValue - societyAnswer <= 0) {
          if (societyValue - societyAnswer >= -7) societyDeterminant = 1;else societyDeterminant = 0;
        }

        if (societyValue - societyAnswer > 0) {
          if (societyValue - societyAnswer <= 7) societyDeterminant = 1;else societyDeterminant = 0;
        }
        /**
         * 이과 점수 판단하기
         */


        if (scienceValue - scienceAnswer <= 0) {
          if (scienceValue - scienceAnswer >= -7) scienceDeterminant = 1;else scienceDeterminant = 0;
        }

        if (scienceValue - scienceAnswer > 0) {
          if (scienceValue - scienceAnswer <= 7) scienceDeterminant = 1;else scienceDeterminant = 0;
        }

        if (scienceDeterminant == 1 && societyDeterminant == 1) pass++;
        console.log("이과예측점수");
        console.log(scienceAnswer);
        console.log("문과예측점수");
        console.log(societyAnswer); // if ( (societyDeterminant == 0 && societyAnswer != -1) || ( scienceDeterminant == 0 && scienceAnswer != -1) ) throw Error('SCORE_NOT_FOUND')

        if (isNaN(societyValue) == false && isNaN(scienceValue) == false) {
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
            perfectScore: sheetData[i][9],
            societyAnswer,
            societyValue,
            societyDeterminant,
            scienceAnswer,
            scienceValue,
            scienceDeterminant
          };
          await _services.testService.create(obj1);
        } else if (isNaN(societyValue) == true && isNaN(scienceValue) == true) {
          let obj3 = {
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
            perfectScore: sheetData[i][9],
            societyDeterminant,
            scienceDeterminant
          };
          await _services.testService.create(obj3);
        } // 문과만됨
        else if (isNaN(scienceValue) == true) {
            let obj3 = {
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
              perfectScore: sheetData[i][9],
              societyAnswer,
              societyValue,
              societyDeterminant,
              scienceAnswer: -1,
              scienceValue: -1,
              scienceDeterminant: -1
            };
            await _services.testService.create(obj3);
          } // 문과만됨
          else if (isNaN(societyValue) == true) {
              let obj2 = {
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
                perfectScore: sheetData[i][9],
                societyAnswer: -1,
                societyValue: -1,
                societyDeterminant: -1,
                scienceAnswer,
                scienceValue,
                scienceDeterminant
              };
              await _services.testService.create(obj2);
            }
      }

      const response = {
        success: true,
        pass
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
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