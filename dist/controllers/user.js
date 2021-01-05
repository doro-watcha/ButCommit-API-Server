"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class userController {
  static async findOne(req, res) {
    try {
      const id = req.params.id;
      const user = await _services.userService.findOne({
        id
      });
      if (user == null) throw Error('USER_NOT_FOUND');
      const response = {
        success: true,
        data: {
          user
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
        academyId: _joi.default.number()
      });
      const {
        academyId
      } = result;
      const where = {
        academyId
      };
      const user = await _services.userService.findList(where);
      const response = {
        success: true,
        data: {
          user
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
        name: _joi.default.string(),
        highSchool: _joi.default.string(),
        line: _joi.default.string(),
        graduateYear: _joi.default.number(),
        editTimes: _joi.default.number(),
        gender: _joi.default.string(),
        haknyeon: _joi.default.string(),
        academyId: _joi.default.number(),
        adminLevel: _joi.default.number(),
        telephone: _joi.default.string(),
        isMoneyPaid: _joi.default.number(),
        password: _joi.default.string()
      });
      const {
        name,
        highSchool,
        line,
        graduateYear,
        gender,
        haknyeon,
        academyId,
        adminLevel,
        telephone,
        isMoneyPaid,
        password
      } = result;
      const modelObj = {
        name,
        highSchool,
        line,
        graduateYear,
        gender,
        haknyeon,
        academyId,
        adminLevel,
        telephone,
        isMoneyPaid,
        password
      };
      const user = await _services.userService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          user
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
      await _services.userService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = userController;