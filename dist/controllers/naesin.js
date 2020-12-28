"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class notificationController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        startScore: _joi.default.number().required(),
        endScore: _joi.default.number().required(),
        value: _joi.default.number().required(),
        univName: _joi.default.string().required(),
        type: _joi.default.string().required(),
        major: _joi.default.string().required()
      });
      const {
        startScore,
        endScore,
        value,
        univName,
        type,
        major
      } = result;
      const obj = {
        startScore,
        endScore,
        value,
        univName,
        type,
        major
      };
      await _services.naesinService.create(obj);
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
      const result = await _joi.default.validate(req.body, {
        score: _joi.default.number().required(),
        univName: _joi.default.string().required(),
        type: _joi.default.string().required()
      });
      const {
        score,
        univName,
        type
      } = result;
      const naesinScore = await _services.naesinService.findOne(score, type, univName);
      if (naesinScore == null) throw Error('NAESIN_SCORE_NOT_FOUND');
      const response = {
        success: true,
        data: {
          value: naesinScore.value
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = notificationController;