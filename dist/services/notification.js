"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class NotificationService {
  constructor() {
    if (!instance) {
      console.log('Notification Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async create(modelObj) {
    return await _models.Notification.create(modelObj);
  }

  async findList(where) {
    return _models.Notification.findAll({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async findOne(where) {
    return await _models.Notification.findOne({
      where: JSON.parse(JSON.stringify(where))
    });
  }

  async update(id, modelObj) {
    await _models.Notification.update(modelObj, {
      where: {
        id
      }
    });
    const updatedNotification = await _models.Notification.findOne({
      where: {
        id
      }
    });
    if (updatedNotification === null) throw Error('FINAL_REPORT_NOT_FOUND');
    return updatedNotification;
  }

  async delete(id) {
    const notification = await _models.Notification.findOne({
      where: {
        id
      }
    });

    if (notification == null) {
      throw Error('FINAL_REPORT_NOT_FOUND');
    } else {
      await notification.destroy();
    }
  }

}

var _default = new NotificationService();

exports.default = _default;