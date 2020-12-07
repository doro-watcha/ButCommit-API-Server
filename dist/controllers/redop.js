"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class redopController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        content: _joi.default.string().required(),
        userId: _joi.default.number().required(),
        consultingId: _joi.default.number().required()
      });
      const {
        content,
        userId,
        consultingId
      } = result;
      const object = {
        content,
        userId,
        consultingId
      };
      await _services.redopService.create(object);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = redopController;