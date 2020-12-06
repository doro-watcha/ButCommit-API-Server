"use strict";

var _controllers = require("../controllers");

var _express = require("express");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate,
  getUserInfo
} = _Authenticator.default;
const router = (0, _express.Router)();
router.post('/', (req, res) => {
  _controllers.naesinController.create(req, res);
});
router.get('/', (req, res) => {
  _controllers.naesinController.findOne(req, res);
});
module.exports = router;