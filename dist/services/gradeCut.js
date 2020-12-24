"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class GradeCutService {
  constructor() {
    if (!instance) {
      console.log('Grade Cut Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.GradeCut.create(modelObj);
  }

  async findOne(where) {
    return await _models.GradeCut.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async delete(year, type) {
    const gradeCut = await _models.GradeCut.findOne({
      where: {
        year,
        type
      }
    });
    if (gradeCut != null) await gradeCut.destroy();
  }

}

var _default = new GradeCutService();

exports.default = _default;