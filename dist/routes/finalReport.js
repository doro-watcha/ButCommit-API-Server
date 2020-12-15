"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate,
  getUserInfo
} = _Authenticator.default;
const router = new _express.Router();
router.post('/', authenticate, (req, res) => {
  _controllers.finalReportController.create(req, res);
});
router.get('/', getUserInfo, (req, res) => {
  _controllers.finalReportController.findList(req, res);
});
router.get('/:id', authenticate, (req, res) => {
  _controllers.finalReportController.findOne(req, res);
});
router.delete('/:id', authenticate, (req, res) => {
  _controllers.finalReportController.delete(req, res);
});
module.exports = router;