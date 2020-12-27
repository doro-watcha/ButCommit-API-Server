"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate
} = _Authenticator.default;
const router = new _express.Router();
const upload_major = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "tomato" + _path.default.extname(file.originalname));
    }
  })
});
const upload_university = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    filename: (req, file, cb) => {
      cb(null, "university" + _path.default.extname(file.originalname));
    }
  })
});
/**
 * 학과 정보 관련 File Upload / Download / Delete / Parsing
 */

router.post('/upload', upload_major.fields([{
  name: 'excel',
  maxCount: 1
}]), (req, res) => {
  _controllers.fileController.upload(req, res);
});
router.get('/major', (req, res) => {
  _controllers.fileController.downloadMajor(req, res);
});
router.delete('/major', (req, res) => {
  _controllers.fileController.deleteMajor(req, res);
});
router.get('/parse', (req, res) => {
  _controllers.fileController.parse(req, res);
});
/**
 * 대학 정보 관련 File Upload / Download/ Delete / Parsing
 */

router.post('/university', upload_university.fields([{
  name: 'excel',
  maxCount: 1
}]), (req, res) => {
  _controllers.fileController.uploadUniv(req, res);
});
router.get('/university', (req, res) => {
  _controllers.fileController.downloadUniv(req, res);
});
router.delete('/university', (req, res) => {
  _controllers.fileController.deleteUniv(req, res);
});
router.get('/university/parse', (req, res) => {
  _controllers.fileController.parseUniv(req, res);
});
module.exports = router;