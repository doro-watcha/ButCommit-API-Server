"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _services = require("../services");

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { commitService } from '../services'
class commitController {
  static async register(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        username: _joi.default.string().required(),
        fcmToken: _joi.default.string().required()
      });
      const {
        username,
        fcmToken
      } = result;
      await _axios.default.get("https://github.com/" + username).catch(function (error) {
        if (error.response.status == 404) {
          throw Error('USER_NOT_FOUND');
        }
      });
      const model = {
        username,
        fcmToken
      };
      await _services.userService.register(model);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async update(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        _username: _joi.default.string().required(),
        username: _joi.default.string().optional(),
        fcmToken: _joi.default.string().optional(),
        isDoing: _joi.default.boolean().optional()
      });
      const {
        _username,
        username,
        fcmToken,
        isDoing
      } = result;
      await _axios.default.get("https://github.com/" + username).catch(function (error) {
        if (error.response.status == 404 && username !== undefined) {
          throw Error('USER_NOT_FOUND');
        }
      });
      const newUser = {
        username,
        fcmToken,
        isDoing
      };
      await _services.userService.update(_username, newUser);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = commitController;