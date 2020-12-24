"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();
const upload = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "gradeCut" + _path.default.extname(file.originalname));
    }
  })
});
router.get('/', (req, res) => {
  _controllers.gradeCutController.findOne(req, res);
});
router.get('/parse', (req, res) => {
  _controllers.gradeCutController.parse(req, res);
});
router.post('/file', upload.fields([{
  name: 'excel',
  maxCount: 1
}]), (req, res) => {
  _controllers.gradeCutController.upload(req, res);
});
module.exports = router;