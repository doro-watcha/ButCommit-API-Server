"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class gradeUniversityController {
  static async findList(req, res) {
    try {
      const gradeUniversities = await _services.gradeUniversityService.findAll();
      const response = {
        success: true,
        data: {
          gradeUniversities
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = gradeUniversityController;