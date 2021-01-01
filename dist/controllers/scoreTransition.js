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

var _variables = require("../utils/variables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class scoreTransitionController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        univName: _joi.default.string.required(),
        subject: _joi.default.string.required(),
        score: _joi.default.object.required()
      });
      const {
        univName,
        subject,
        score
      } = result;
      const modelObj = {
        univName,
        subject,
        score
      };
      await _services.scoreTransitionService.create(modelObj);
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
        univName: _joi.default.string.required(),
        subject: _joi.default.string.required()
      });
      const {
        univName,
        subject
      } = result;
      const translatedScore = await _services.scoreTransitionService.findOne({
        univName,
        subject
      });
      res.send(translatedScore.score);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async parse() {
    const path = '../excelfile/tomato.xlsx';

    let workbook = _xlsx.default.readFile(path, {
      sheetRows: 10000
    });

    let sheetsList = workbook.SheetNames;
    await _services.scoreTransitionService.deleteAll();

    let sheetData5 = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[5]], {
      header: 1,
      defval: '',
      blankrows: true
    });

    var line = sheetData5[0][0];
    var univName = sheetData5[0][1];
    var major = sheetData5[0][2];

    for (let i = 1; i < sheetData5.length; i++) {
      let data = {};

      if (sheetData5[i][5] == "백분위") {
        data = {
          value: sheetData5[i].slice(56, 157)
        };
      } else {
        data = {
          value: sheetData5[i].slice(6, 157)
        };
      }

      if (sheetData5[i][0].length > 1) line = sheetData5[i][0];
      if (sheetData5[i][0].length > 1) univName = sheetData5[i][1];
      if (sheetData5[i][0].length > 1) major = sheetData5[i][2];
      let obj = {
        id: i,
        line,
        univName,
        major,
        subject: sheetData5[i][3],
        applicationIndicator: sheetData5[i][5],
        score: data
      };

      _variables.SCORE_TRANSITION.push(obj);

      await _services.scoreTransitionService.create(obj);
    }

    console.log("변환표준점수 파싱 완료 "); //await naesinService.deleteAll()

    let sheetData3 = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[3]], {
      header: 1,
      defval: '',
      blankrows: true
    });

    for (let i = 1; i < sheetData3.length - 1; i = i + 4) {
      for (let j = 7; j < sheetData3[i].length - 7; j++) {
        if (sheetData3[i][j].length == 0) break;
        let naesin_section = String(sheetData3[i][j]).split('~');
        let startScore = naesin_section[0];
        let endScore = 0.0;

        if (naesin_section.length > 1) {
          endScore = naesin_section[1];
        } else if (naesin_section.length == 1) {
          endScore = naesin_section[0];
        }

        let obj = {
          type: "내신",
          univName: sheetData3[i][0],
          recruitmentType: sheetData3[i][1],
          sosokUniversity: sheetData3[i][2],
          recruitmentUnit: sheetData3[i][3],
          applicationIndicator: sheetData3[i][6],
          major: sheetData3[i][4],
          startScore: parseFloat(startScore),
          endScore: parseFloat(endScore),
          value: sheetData3[i + 1][j]
        };

        _variables.NAESIN.push(obj); //await naesinService.create(obj)

      }

      for (let j = 7; j < sheetData3[i].length - 7; j++) {
        if (sheetData3[i + 2][j].length == 0) break;else if (sheetData3[i + 2][j] == " ( 수능 점수 - 한국사 점수 ) / 9 ") break;else if (sheetData3[i + 2][j] == "산출 불가") break;else if (sheetData3[i + 2][j] == "all") break;else if (sheetData3[i + 2][j] == "( 국어 백분위 + 수학 백분위 + 영어 환산표 점수 + 탐구 평균 백분위 ) x 1.25") break;
        let gumjeong_section = String(sheetData3[i + 2][j]).split('~');
        let startScore = gumjeong_section[0];
        let endScore = 0.0;

        if (gumjeong_section.length > 1) {
          endScore = gumjeong_section[1];
        } else if (gumjeong_section == 1) {
          endScore = gumjeong_section[0];
        }

        let obj = {
          type: "검정고시",
          univName: sheetData3[i][0],
          recruitmentType: sheetData3[i][1],
          sosokUniversity: sheetData3[i][2],
          recruitmentUnit: sheetData3[i][3],
          applicationIndicator: sheetData3[i][6],
          major: sheetData3[i][4],
          startScore: parseFloat(startScore),
          endScore: parseFloat(endScore),
          value: sheetData3[i + 3][j]
        };

        _variables.NAESIN.push(obj); //await naesinService.create(obj)

      }
    }

    console.log("내신 점수 파싱완료");
  }

}

exports.default = scoreTransitionController;