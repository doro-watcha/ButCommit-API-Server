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

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class highestScoreController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        subject: _joi.default.string().required(),
        type: _joi.default.string().required(),
        score: _joi.default.number().required()
      });
      const {
        subject,
        type,
        score
      } = result;
      const modelObj = {
        subject,
        type,
        score
      };
      await _services.highestScoreService.create(modelObj);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = highestScoreController;