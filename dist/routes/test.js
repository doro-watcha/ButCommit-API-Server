"use strict";

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');

const {
  authenticate,
  getUserInfo
} = _Authenticator.default;
var router = express.Router();
const upload_test = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "test" + _path.default.extname(file.originalname));
    }
  })
});
router.get('/file', (req, res) => {
  _controllers.testController.downloadFile(req, res);
});
router.post('/file', upload_test.fields([{
  name: 'excel',
  maxCount: 1
}]), (req, res) => {
  _controllers.testController.uploadFile(req, res);
});
router.get('/parse', (req, res) => {
  _controllers.testController.parse(req, res);
});
router.get('/', (req, res) => {
  _controllers.testController.test(req, res);
});
router.get('/list', (req, res) => {
  _controllers.testController.getList(req, res);
});
module.exports = router;