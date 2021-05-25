"use strict";

var _commit = _interopRequireDefault(require("./commit"));

var _user = _interopRequireDefault(require("./user"));

var _group = _interopRequireDefault(require("./group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.use('/commit', _commit.default);
router.use('/user', _user.default);
router.use('/group', _group.default);
module.exports = router;