"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _report = _interopRequireDefault(require("./report"));

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class majorController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        line: _joi.default.string().required(),
        group: _joi.default.string().required(),
        location: _joi.default.string().required(),
        recruitmentType: _joi.default.string().required(),
        univName: _joi.default.string().required(),
        recruitmentUnit: _joi.default.string().required(),
        majorName: _joi.default.string().required()
      });
      const {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      } = result;
      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      };
      const major = await _services.majorService.create(modelObj);
      const response = {
        success: true,
        data: {
          major
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findList(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        line: _joi.default.string(),
        group: _joi.default.string(),
        location: _joi.default.string(),
        recruitmentType: _joi.default.string(),
        univName: _joi.default.string(),
        recruitmentUnit: _joi.default.string(),
        majorName: _joi.default.string()
      });
      const {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      } = result;
      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      };
      const majors = await _services.majorService.findList(modelObj);
      const response = {
        success: true,
        data: {
          majors
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
      const major = await _services.majorService.findOne({
        id
      });
      const response = {
        success: true,
        data: {
          major
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findInternalMajorList(req, res) {
    try {
      const result = await _joi.default.validate(req.query, {
        univName: _joi.default.string().required()
      });
      const {
        user
      } = req;
      const {
        univName
      } = result;
      const score = await _services.scoreService.findOne({
        userId: user.id
      });
      console.log(univName);
      const majors = await _services.majorService.findList({
        univName
      });
      const majorDataList = [];

      for (let i = 0; i < majors.length; i++) {
        let majorData = await _services.majorDataService.findOne({
          majorId: majors[i].id
        });
        majorDataList.push(majorData);
      }

      majorDataList.sort(function (a, b) {
        return b.prediction.safe - a.prediction.safe;
      });
      let minGap = 10000;
      let pickedMajor = null;

      for (let i = 0; i < majorDataList.length; i++) {
        let myScore = await _report.default.getScore(score, majorDataList[i], false);
        let difference = myScore - majorDataList[i].prediction.safe;

        if (difference > 0 && difference < minGap) {
          pickedMajor = majorDataList[i].major;
          minGap = difference;
        }
      }

      const response = {
        success: true,
        data: {
          majors,
          pickedMajor
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
        line: _joi.default.string(),
        group: _joi.default.string(),
        location: _joi.default.string(),
        recruitmentType: _joi.default.string(),
        univName: _joi.default.string(),
        recruitmentUnit: _joi.default.string(),
        majorName: _joi.default.string()
      });
      const {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      } = result;
      const modelObj = {
        line,
        group,
        location,
        recruitmentType,
        univName,
        recruitmentUnit,
        majorName
      };
      const major = await _services.majorService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          major
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
      await _services.majorService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = majorController;