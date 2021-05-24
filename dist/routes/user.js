"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate
} = _Authenticator.default;
const router = new _express.Router();
router.post('/', (req, res) => {
  _controllers.userController.register(req, res);
});
router.patch('/', (req, res) => {
  _controllers.userController.update(req, res);
});
module.exports = router;