"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class AutoTransitionService {
  constructor() {
    if (!instance) {
      console.log('AutoTraisition Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.AutoTransition.create(modelObj);
  }

  async findOne(where) {
    return await _models.AutoTransition.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async deleteAll() {
    return await _models.AutoTransition.destroy({
      where: {}
    });
  }

}

var _default = new AutoTransitionService();

exports.default = _default;