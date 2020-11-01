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
  highestScoreService: _highestScore.default
};