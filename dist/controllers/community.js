"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class communityController {
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
      const {
        user
      } = req;
      const modelObj = {
        body,
        title,
        userId: user.id
      }; // create user

      await _services.communityService.create(modelObj); // create response

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
      console.log("fuck");
      const communities = await _services.communityService.findList({});
      console.log("zxcvzxcv");
      const response = {
        success: true,
        data: {
          communities
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
      const community = await _services.communityService.findOne({
        id
      });
      if (community == null) throw Error('COMMUNITY_NOT_FOUND');
      const response = {
        success: true,
        data: {
          community
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
      const community = await _services.communityService.update(id, modelObj);
      const response = {
        success: true,
        data: {
          community
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
      await _services.communityService.delete(id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = communityController;