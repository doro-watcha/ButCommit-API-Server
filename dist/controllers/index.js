"use strict";

var _commit = _interopRequireDefault(require("./commit"));

var _user = _interopRequireDefault(require("./user"));

var _group = _interopRequireDefault(require("./group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  commitController: _commit.default,
  userController: _user.default,
  groupController: _group.default
};