"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class HighestScoreService {
  constructor() {
    if (!instance) {
      console.log('HighestScore Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async findOne(subject, type) {
    return await _models.HighestScore.findOne({
      where: {
        subject,
        type
      }
    });
  }

  async create(modelObj) {
    return await _models.HighestScore.create(modelObj);
  }

  async deleteAll() {
    return await _models.HighestScore.destroy({
      where: {}
    });
  }

}

var _default = new HighestScoreService();

exports.default = _default;