"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class GradeUniversityService {
  constructor() {
    if (!instance) {
      console.log('GradeUniversity Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async findAll() {
    return await _models.GradeUniversity.findAll();
  }

}

var _default = new GradeUniversityService();

exports.default = _default;