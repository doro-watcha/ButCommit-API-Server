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
      var majorDataList = [];
      const result = await _joi.default.validate(req.body, {
        year: _joi.default.number(),
        group: _joi.default.string().optional(),
        location: _joi.default.array().optional(),
        type: _joi.default.string().optional(),
        line: _joi.default.string().optional(),
        univName: _joi.default.string().optional(),
        mathType: _joi.default.string().optional(),
        tamguType: _joi.default.string().optional()
      });
      const {
        year,
        group,
        location,
        type,
        line,
        univName,
        mathType,
        tamguType
      } = result;
      console.log(group);
      console.log(location);
      console.log(type);
      console.log(line);
      console.log(univName);
      console.log(mathType);
      console.log(tamguType);
      const modelObj = {
        year
      };
      const {
        user
      } = req;
      const score = await _services.scoreService.findOne({
        userId: user.id
      });
      const majorDataNotFiltered = await _services.majorDataService.findList(modelObj);
      majorDataList = majorDataNotFiltered; // 군 필터링

      if (group !== undefined) {
        majorDataList = majorDataList.filter(item => {
          return item.major.group === group;
        });
      } // 대학 이름 필터링


      if (univName !== undefined) {
        majorDataList = majorDataList.filter(item => {
          return item.major.univName === univName;
        });
      } // 계열 필터링


      if (line !== undefined) {
        majorDataList = majorDataList.filter(item => {
          return item.major.line === line;
        });
      } // 지역 필터링


      if (location !== undefined) {
        majorDataList = majorDataList.filter(item => {
          return location.includes(item.major.location);
        });
      } // 종류/분야 필터링


      if (type !== undefined) {
        if (type === "간호") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName.indexOf("간호") >= 0;
          });
        } else if (type === "의예") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "의예과";
          });
        } else if (type === "의학") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "의학과";
          });
        } else if (type === "치의") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "치의예과";
          });
        } else if (type === "초등교육") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "초등교육과";
          });
        } else if (type === "한의") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "한의예과";
          });
        } else if (type === "수의") {
          majorDataList = majorDataList.filter(item => {
            return item.major.majorName === "수의예과";
          });
        }
      } // 수학 가/나 필터링


      if (mathType !== undefined) {
        if (mathType === "가") {
          majorDataList = majorDataList.filter(item => {
            return item.ratio.math.ga > 0;
          });
        } else if (mathType === "나") {
          majorDataList = majorDataList.filter(item => {
            return item.ratio.math.na > 0;
          });
        }
      } // 과탐 ,사탐 필터링


      if (tamguType !== undefined) {
        if (tamguType === "과탐") {
          majorDataList = majorDataList.filter(item => {
            return item.ratio.tamgu.science > 0;
          });
        } else if (tamguType === "사탐") {
          majorDataList = majorDataList.filter(item => {
            return item.ratio.tamgu.society > 0;
          });
        }
      }

      console.log(majorDataNotFiltered.length);
      console.log(majorDataList.length);
      let majorDatas = [];

      for (let i = 3; i < majorDataList.length; i++) {
        let majorData = majorDataList[i - 3];
        let transitionScore = 0;

        if (score.line == "인문" && majorData.ratio.tamgu.society > 0) {
          transitionScore = await _report.default.getScore(score, majorData, false);
        } else if (score.line == "자연" && majorData.ratio.tamgu.science > 0) {
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

  static async findListByFilter(req, res) {
    try {
      const {
        req
      } = user;
      const result = await _joi.default.validate(req.query, {
        group: _joi.default.string().optional(),
        location: _joi.default.string().optional(),
        type: _joi.default.string().optional(),
        line: _joi.default.string().optional(),
        univName: _joi.default.string().optional(),
        mathType: _joi.default.string().optional(),
        tamguType: _joi.default.string().required()
      });
      const {
        group,
        location,
        type,
        line,
        univName,
        mathType,
        tamguType
      } = result;
      const options = {
        group,
        location,
        type,
        line,
        univName,
        mathType,
        tamguType
      };
      const majorDataList = await _services.majorDataService.findByFilter(options);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = majorDataController;