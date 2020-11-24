"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class CommunityService {
  constructor() {
    if (!instance) {
      console.log('Community Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.Community.create(modelObj);
  }

  async findList(where) {
    return _models.Community.findAll({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async findOne(where) {
    return await _models.Community.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async update(id, modelObj) {
    await _models.Community.update(modelObj, {
      where: {
        id
      }
    });
    const updatedCommunity = await _models.Community.findOne({
      where: {
        id
      }
    });
    if (updatedCommunity === null) throw Error('COMMUNITY_NOT_FOUND');
    return updatedCommunity;
  }

  async delete(id) {
    const community = await _models.Community.findOne({
      where: {
        id
      }
    });

    if (community == null) {
      throw Error('COMMUNITY_NOT_FOUND');
    } else {
      await community.destroy();
    }
  }

}

var _default = new CommunityService();

exports.default = _default;