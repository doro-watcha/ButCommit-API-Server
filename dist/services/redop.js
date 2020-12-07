"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class RedopService {
  constructor() {
    if (!instance) {
      console.log('Redop Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return _models.Redop.create(modelObj);
  }

}

var _default = new RedopService();

exports.default = _default;