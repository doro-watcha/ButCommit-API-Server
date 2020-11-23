"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class ScoreTransitionService {
  constructor() {
    if (!instance) {
      console.log('Score Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.ScoreTransition.create(modelObj);
  }

  async findOne(where) {
    return await _models.ScoreTransition.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async deleteAll() {
    return await _models.ScoreTransition.destroy({
      where: {}
    });
  }

}

var _default = new ScoreTransitionService();

exports.default = _default;