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
  _controllers.finalReportDataController.create(req, res);
});
router.get('/', (req, res) => {
  _controllers.finalReportDataController.findList(req, res);
});
router.get('/:id', (req, res) => {
  _controllers.finalReportDataController.findOne(req, res);
});
router.patch('/:id', (req, res) => {
  _controllers.finalReportDataController.update(req, res);
});
module.exports = router;