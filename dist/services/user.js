"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

let instance = null;

class UserService {
  constructor() {
    if (!instance) {
      console.log('User Service 생성' + this);
      instance = this;
    }

    return instance;
  }

  async register(user) {
    const alreadyUser = await _models.User.findOne({
      username: user.username
    });
    if (alreadyUser != null) throw Error('USER_ALREADY_EXISTS');
    await _models.User.create(user);
    return true;
  }

  async update(username, newUser) {
    await _models.User.update(newUser, {
      where: {
        username
      }
    });
    return true;
  }

}

var _default = new UserService();

exports.default = _default;