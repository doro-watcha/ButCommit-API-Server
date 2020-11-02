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
module.exports = router;