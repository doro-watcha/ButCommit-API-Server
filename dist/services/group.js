"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class GroupService {
  constructor() {
    if (!instance) {
      console.log('Group Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(group) {}

}

var _default = new GroupService();

exports.default = _default;