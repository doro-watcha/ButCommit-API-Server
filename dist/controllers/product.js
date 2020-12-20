"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _axios = _interopRequireDefault(require("axios"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class productController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        name: _joi.default.string().required(),
        amount: _joi.default.number().required()
      });
      const {
        name,
        amount
      } = result;
      const modelObj = {
        name,
        amount
      };
      await _services.productService.create(modelObj);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = productController;