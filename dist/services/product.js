"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class ProductService {
  constructor() {
    if (!instance) {
      console.log('Product Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return _models.Product.create(modelObj);
  }

  async findOne(where) {
    return await _models.Product.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

}

var _default = new ProductService();

exports.default = _default;