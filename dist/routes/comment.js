"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate
} = _Authenticator.default;
const router = new _express.Router();
router.post('/', authenticate, (req, res) => {
  _controllers.commentController.create(req, res);
});
router.get('/', (req, res) => {
  _controllers.commentController.findList(req, res);
});
router.get('/:id', (req, res) => {
  _controllers.commentController.findOne(req, res);
});
router.patch('/:id', (req, res) => {
  _controllers.commentController.update(req, res);
});
router.delete('/:id', (req, res) => {
  _controllers.commentController.delete(req, res);
});
module.exports = router;