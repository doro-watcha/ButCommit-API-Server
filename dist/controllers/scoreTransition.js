"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

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

}

exports.default = scoreTransitionController;