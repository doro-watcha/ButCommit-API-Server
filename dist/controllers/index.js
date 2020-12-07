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

var _finalReport = _interopRequireDefault(require("./finalReport"));

var _notification = _interopRequireDefault(require("./notification"));

var _community = _interopRequireDefault(require("./community"));

var _gradeUniversity = _interopRequireDefault(require("./gradeUniversity"));

var _comment = _interopRequireDefault(require("./comment"));

var _naesin = _interopRequireDefault(require("./naesin"));

var _autoTransition = _interopRequireDefault(require("./autoTransition"));

var _redop = _interopRequireDefault(require("./redop"));

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
  scoreTransitionController: _scoreTransition.default,
  finalReportController: _finalReport.default,
  notificationController: _notification.default,
  communityController: _community.default,
  gradeUniversityController: _gradeUniversity.default,
  commentController: _comment.default,
  naesinController: _naesin.default,
  autoTransitionController: _autoTransition.default,
  redopController: _redop.default
};