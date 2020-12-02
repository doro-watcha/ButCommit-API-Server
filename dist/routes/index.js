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

var _community = _interopRequireDefault(require("./community"));

var _notification = _interopRequireDefault(require("./notification"));

var _gradeUniversity = _interopRequireDefault(require("./gradeUniversity"));

var _naesin = _interopRequireDefault(require("./naesin"));

var _comment = _interopRequireDefault(require("./comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.use('/university', _university.default);
router.use('/score', _score.default);
router.use('/auth', _auth.default);
router.use('/user', _user.default);
router.use('/report', _report.default);
router.use('/major', _major.default);
router.use('/consulting', _consulting.default);
router.use('/paymentRecord', _paymentRecord.default);
router.use('/academy', _academy.default);
router.use('/file', _file.default);
router.use('/majorData', _majorData.default);
router.use('/test', _test.default);
router.use('/highestScore', _highestScore.default);
router.use('/scoreTransition', _scoreTransition.default);
router.use('/notification', _notification.default);
router.use('/community', _community.default);
router.use('/finalReport', _finalReport.default);
router.use('/gradeUniversity', _gradeUniversity.default);
router.use('/naesin', _naesin.default);
router.use('/comment', _comment.default);
module.exports = router;