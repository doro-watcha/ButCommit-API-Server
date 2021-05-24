"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class CommitService {
  constructor() {
    if (!instance) {
      console.log('Commit Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await Commit.create(modelObj);
  }

}

var _default = new CommitService();

exports.default = _default;