"use strict";

var _university = _interopRequireDefault(require("./university"));

var _score = _interopRequireDefault(require("./score"));

var _auth = _interopRequireDefault(require("./auth"));

var _user = _interopRequireDefault(require("./user"));

var _report = _interopRequireDefault(require("./report"));

var _major = _interopRequireDefault(require("./major"));

var _consulting = _interopRequireDefault(require("./consulting"));

var _paymentRecord = _interopRequireDefault(require("./paymentRecord"));

var _academy = _interopRequireDefault(require("./academy"));

var _file = _interopRequireDefault(require("./file"));

var _majorData = _interopRequireDefault(require("./majorData"));

var _test = _interopRequireDefault(require("./test"));

var _highestScore = _interopRequireDefault(require("./highestScore"));

var _scoreTransition = _interopRequireDefault(require("./scoreTransition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  universityController: _university.default,
  scoreController: _score.default,
  authController: _auth.default,
  userController: _user.default,
  reportController: _report.default,
  majorController: _major.default,
  consultingController: _consulting.default,
  paymentRecordController: _paymentRecord.default,
  academyController: _academy.default,
  fileController: _file.default,
  majorDataController: _majorData.default,
  testController: _test.default,
  highestScoreController: _highestScore.default,
  scoreTransitionController: _scoreTransition.default
};