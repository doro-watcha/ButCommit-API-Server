"use strict";

var _express = require("express");

var _controllers = require("../controllers");

const router = new _express.Router();
router.get('/', (req, res) => {
  _controllers.gradeUniversityController.findList(req, res);
});
module.exports = router;