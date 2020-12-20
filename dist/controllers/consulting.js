"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class consultingController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        title: _joi.default.string().required(),
        description: _joi.default.string().required(),
        isAdmin: _joi.default.number(),
        userId: _joi.default.number().required()
      });
      const {
        title,
        description,
        isAdmin,
        userId
      } = result;
      const modelObj = {
        title,
        description,
        userId,
        isAdmin
      };
      const user = await _services.userService.findOne({
        id: userId
      });
      const newUser = {
        consultingTimes: user.consultingTImes - 1
      };
      if (user.consultingTimes <= 0) throw Error('CONSULTING_TIMES_NOT_FOUND');else await _services.userService.update(user.id, newUser);
      const consulting = await _services.consultingService.create(modelObj);
      const response = {
        success: true,
        data: {
          consulting
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
        userId: _joi.default.number()
      });
      const {
        userId
      } = result;
      const consultings = await _services.consultingService.findList({
        userId
      });
      const response = {
        success: true,
        data: {
          consultings
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
      const consulting = await _services.consultingService.findOne({
        id
      });
      if (consulting == null) throw Error('CONSULTING_NOT_FOUND');
      const response = {
        success: true,
        data: {
          consulting
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async update(req, res) {
    try {
      const {
        user
      } = req;
      const id = req.params.id;
      const result = await _joi.default.validate(req.body, {
        title: _joi.default.string(),
        description: _joi.default.string()
      });
      const {
        title,
        description
      } = result;
      const modelObj = {
        title,
        description,
        userId: user.id
      };
      const consulting = await _services.consultingService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          consulting
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
      await _services.consultingService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = consultingController;