"use strict";

var _university = _interopRequireDefault(require("./university"));

var _score = _interopRequireDefault(require("./score"));

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

var _community = _interopRequireDefault(require("./community"));

var _finalReport = _interopRequireDefault(require("./finalReport"));

var _notification = _interopRequireDefault(require("./notification"));

var _gradeUniversity = _interopRequireDefault(require("./gradeUniversity"));

var _naesin = _interopRequireDefault(require("./naesin"));

var _autoTransition = _interopRequireDefault(require("./autoTransition"));

var _redop = _interopRequireDefault(require("./redop"));

var _reportData = _interopRequireDefault(require("./reportData"));

var _finalReportData = _interopRequireDefault(require("./finalReportData"));

var _product = _interopRequireDefault(require("./product"));

var _gradeCut = _interopRequireDefault(require("./gradeCut"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  universityService: _university.default,
  scoreService: _score.default,
  userService: _user.default,
  reportService: _report.default,
  majorService: _major.default,
  consultingService: _consulting.default,
  paymentRecordService: _paymentRecord.default,
  academyService: _academy.default,
  fileService: _file.default,
  majorDataService: _majorData.default,
  testService: _test.default,
  highestScoreService: _highestScore.default,
  scoreTransitionService: _scoreTransition.default,
  communityService: _community.default,
  finalReportService: _finalReport.default,
  notificationService: _notification.default,
  gradeUniversityService: _gradeUniversity.default,
  naesinService: _naesin.default,
  autoTransitionService: _autoTransition.default,
  redopService: _redop.default,
  reportDataService: _reportData.default,
  finalReportDataService: _finalReportData.default,
  productService: _product.default,
  gradeCutService: _gradeCut.default
};