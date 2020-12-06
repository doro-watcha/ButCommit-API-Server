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
const upload_file = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "autoTransition" + _path.default.extname(file.originalname));
    }
  })
});
router.post('/', authenticate, (req, res) => {
  _controllers.autoTransitionController.create(req, res);
});
router.post('/file', upload_file.fields([{
  name: 'excel',
  maxCount: 1
}]), (req, res) => {
  _controllers.autoTransitionController.uploadFile(req, res);
});
router.get('/parse', (req, res) => {
  _controllers.autoTransitionController.parseFile(req, res);
});
router.get('/', (req, res) => {
  _controllers.autoTransitionController.findOne(req, res);
});
module.exports = router;