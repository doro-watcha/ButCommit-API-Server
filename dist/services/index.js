"use strict";

var _commit = _interopRequireDefault(require("./commit"));

var _fcm = _interopRequireDefault(require("./fcm"));

var _user = _interopRequireDefault(require("./user"));

var _group = _interopRequireDefault(require("./group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  commitService: _commit.default,
  fcmService: _fcm.default,
  userService: _user.default,
  groupService: _group.default
};