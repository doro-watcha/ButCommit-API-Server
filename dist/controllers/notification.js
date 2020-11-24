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
        body: _joi.default.string().required(),
        title: _joi.default.string().required()
      });
      const {
        body,
        title
      } = result;
      const modelObj = {
        body,
        title
      }; // create user

      await _services.notificationService.create(modelObj); // create response

      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async findList(req, res) {
    try {
      const notifications = await _services.notificationService.findList({});
      const response = {
        success: true,
        data: {
          notifications
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
      const notification = await _services.notificationService.findOne({
        id
      });
      if (notification == null) throw Error('NOTIFICATION_NOT_FOUND');
      const response = {
        success: true,
        data: {
          notification
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
        title: _joi.default.string(),
        body: _joi.default.string()
      });
      const {
        title,
        body
      } = result;
      const modelObj = {
        title,
        body
      };
      const notification = await _services.notificationService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          notification
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
      await _services.notificationService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = notificationController;