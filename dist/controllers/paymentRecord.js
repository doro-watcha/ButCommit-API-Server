"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class majorController {
  static async create(req, res) {
    try {
      const {
        user
      } = req;
      const result = await _joi.default.validate(req.body, {
        amount: _joi.default.number().required(),
        orderNumber: _joi.default.string().required()
      });
      const {
        amount,
        predictTimes
      } = result;
      const modelObj = {
        userId: user.id,
        amount,
        predictTimes
      };
      const paymentRecord = await _services.paymentRecordService.create(modelObj);
      const response = {
        success: true,
        data: {
          paymentRecord
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findOne(req, res) {
    try {
      const {
        user
      } = req;
      const id = req.params.id;
      const paymentRecord = await _services.paymentRecordService.findOne({
        userId: user.id,
        id
      });
      const response = {
        success: true,
        data: {
          paymentRecord
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findList(req, res) {
    try {
      const {
        user
      } = req;
      const result = await _joi.default.validate(req.query, {
        amount: _joi.default.number(),
        predictTimes: _joi.default.number()
      });
      const {
        amount,
        predictTimes
      } = result;
      const modelObj = {
        userId: user.id,
        amount,
        predictTimes
      };
      const paymentRecord = await _services.paymentRecordService.findList(modelObj);
      const response = {
        success: true,
        data: {
          paymentRecord
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
        amount: _joi.default.number(),
        predictTimes: _joi.default.number()
      });
      const {
        amount,
        predictTimes
      } = result;
      const modelObj = {
        amount,
        predictTimes
      };
      const paymentRecord = await _services.paymentRecordService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          paymentRecord
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
      await _services.paymentRecordService.delete(id);
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