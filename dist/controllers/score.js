"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _services = require("../services");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _functions = require("../utils/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class scoreController {
  static async create(req, res) {
    try {
      const result = await _joi.default.validate(req.body, {
        korean: _joi.default.object().required(),
        math: _joi.default.object().required(),
        english: _joi.default.object().required(),
        tamgu1: _joi.default.object().required(),
        tamgu2: _joi.default.object().required(),
        history: _joi.default.object().required(),
        foreign: _joi.default.object().optional(),
        line: _joi.default.string().required(),
        naesin: _joi.default.number(),
        naesin_type: _joi.default.string(),
        gumjeong: _joi.default.number()
      });
      const {
        korean,
        math,
        english,
        tamgu1,
        tamgu2,
        history,
        foreign,
        line,
        naesin,
        naesin_type,
        gumjeong
      } = result;
      const {
        user
      } = req;
      const modelObj = {
        userId: user.id,
        korean,
        math,
        english,
        tamgu1,
        tamgu2,
        history,
        foreign,
        line,
        naesin,
        naesin_type,
        gumjeong
      };
      const newUser = {
        editTimes: user.editTimes - 1,
        searchScore: (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile) / 4
      };
      if (user.editTimes <= 0) throw Error('EDIT_TIMES_NOT_FOUND');else await _services.userService.update(user.id, newUser);
      const exist_score = await _services.scoreService.findOne({
        userId: user.id
      });
      if (exist_score != null) throw Error('SCORE_ALREADY_EXISTS');
      const score = await _services.scoreService.create(modelObj);
      const response = {
        success: true,
        data: {
          score
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
      const score = await _services.scoreService.findOne({
        userId: user.id
      });
      const response = {
        success: true,
        data: {
          score
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
      const result = await _joi.default.validate(req.body, {
        korean: _joi.default.object().required(),
        math: _joi.default.object().required(),
        english: _joi.default.object().required(),
        tamgu1: _joi.default.object().required(),
        tamgu2: _joi.default.object().required(),
        history: _joi.default.object().required(),
        foreign: _joi.default.object().optional(),
        line: _joi.default.string().required(),
        naesin: _joi.default.number(),
        naesin_type: _joi.default.string(),
        gumjeong: _joi.default.number()
      });
      const {
        korean,
        math,
        english,
        tamgu1,
        tamgu2,
        history,
        foreign,
        line,
        naesin,
        naesin_type,
        gumjeong
      } = result;
      const modelObj = {
        userId: user.id,
        korean,
        math,
        english,
        tamgu1,
        tamgu2,
        history,
        foreign,
        line,
        naesin,
        naesin_type,
        gumjeong
      };
      console.log(user.editTimes);
      const newUser = {
        editTimes: user.editTimes - 1,
        searchScore: (korean.percentile + math.percentile + tamgu1.percentile + tamgu2.percentile) / 4
      };
      if (user.editTimes <= 0) throw Error('EDIT_TIMES_NOT_FOUND');else await _services.userService.update(user.id, newUser);
      const score = await _services.scoreService.update(user.id, modelObj);
      if (score == null) throw Error('SCORE_NOT_FOUND');
      const response = {
        success: true,
        data: {
          score
        }
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

  static async delete(req, res) {
    try {
      const {
        user
      } = req;
      await _services.scoreService.delete(user.id);
      const response = {
        success: true
      };
      res.send(response);
    } catch (e) {
      res.send((0, _functions.createErrorResponse)(e));
    }
  }

}

exports.default = scoreController;