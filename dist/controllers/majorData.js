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

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _functions = require("../utils/functions");

var _report = _interopRequireDefault(require("./report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class majorDataController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        year: _joi.default.number().required(),
        majorId: _joi.default.number().required(),
        metadata: _joi.default.object(),
        prediction: _joi.default.object(),
        ratio: _joi.default.object(),
        gradeToScore: _joi.default.object()
      }); // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, extraPoint, somethingSpecial

      const {
        year,
        majorId,
        metadata,
        prediction,
        ratio,
        gradeToScore
      } = result;
      const modelObj = {
        year,
        majorId,
        metadata,
        prediction,
        ratio,
        gradeToScore
      };
      const already_majorData = await _services.majorService.findOne({
        majorId
      });
      if (already_majorData == null) throw Error('MAJOR_NOT_FOUND');
      const majorData = await _services.majorDataService.create(modelObj);
      const response = {
        success: true,
        data: {
          majorData
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
      const majorData = await _services.majorDataService.findOne({
        majorId: id
      });
      const response = {
        success: true,
        data: {
          majorData
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findList(req, res) {
    try {
      const path = '../excelfile/test.xlsx';

      let workbook = _xlsx.default.readFile(path, {
        sheetRows: 3524
      });

      let sheetsList = workbook.SheetNames;

      let sheetData = _xlsx.default.utils.sheet_to_json(workbook.Sheets[sheetsList[1]], {
        header: 1,
        defval: '',
        blankrows: true
      });

      const result = await _joi.default.validate(req.query, {
        year: _joi.default.number(),
        majorId: _joi.default.number()
      });
      const {
        year,
        majorId
      } = result;
      const modelObj = {
        year,
        majorId
      };
      const {
        user
      } = req;
      const score = await _services.scoreService.findOne({
        userId: user.id
      });
      const if_none_match = req.headers['if-none-match'];

      if (_bcrypt.default.compareSync(score.updatedAt + user.email, if_none_match)) {
        const response = {
          success: true,
          status: 304
        };
        res.send(response);
      }

      const majorDataList = await _services.majorDataService.findList(modelObj);
      let majorDatas = [];

      for (let i = 3; i < 3524; i++) {
        let societyAnswer = parseFloat(sheetData[i][19]);
        let scienceAnswer = parseFloat(sheetData[i][20]);
        let majorData = majorDataList[i - 3];
        console.log("SocietyAnswer == " + societyAnswer);
        console.log("scienceAnswer = " + scienceAnswer);
        console.log(score.line);
        console.log(majorData.major.majorName);
        console.log(majorData.major.univName);
        let transitionScore = 0;

        if (isNaN(societyAnswer) == false && score.line == "인문") {
          transitionScore = await _report.default.getScore(score, majorData, false);
        } else if (isNaN(scienceAnswer) == false && score.line == "자연") {
          transitionScore = await _report.default.getScore(score, majorData, false);
        }

        let prediction = "최초합유력";

        if (majorData.prediction.strong > transitionScore && transitionScore >= majorData.prediction.safe) {
          prediction = "지원 적정";
        } else if (majorData.prediction.safe > transitionScore && transitionScore >= majorData.prediction.dangerous) {
          prediction = "추합 스나이핑";
        } else if (majorData.prediction.dangerous > transitionScore) {
          prediction = "위험 불합격";
        }

        let obj = {
          majorData,
          prediction,
          myScore: transitionScore,
          majorScore: majorData.prediction.safe
        };
        majorDatas.push(obj);
      }

      const response = {
        success: true,
        data: {
          majorDatas
        }
      };

      const eTag = _bcrypt.default.hashSync(score.updatedAt + user.email, 8);

      res.set('Cache-Control', `no-cache, private, max-age=36000`);
      res.set('etag', eTag);
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const result = await _joi.default.validate(req.body, {
        majorId: _joi.default.number(),
        year: _joi.default.number(),
        metadata: _joi.default.object(),
        prediction: _joi.default.object(),
        ratio: _joi.default.object(),
        gradeToScore: _joi.default.object()
      }); // metadata = initialMember , additionalMember , competitionRate, reflectionSubject, tamguNumber , applicationIndicator, additionalPoint, somethingSpecial

      const {
        majorId,
        year,
        metadata,
        prediction,
        ratio,
        gradeToScore
      } = result;
      const modelObj = {
        majorId,
        year,
        metadata,
        prediction,
        ratio,
        gradeToScore
      };
      const majorData = await _services.majorDataService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          majorData
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
      await _services.majorDataService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = majorDataController;