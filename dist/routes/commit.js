"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate
} = _Authenticator.default;
const router = new _express.Router();
router.get('/', (req, res) => {
  _controllers.commitController.crawl(req, res);
});
/**
 * @swagger
 *
 * /commit:
 *   get:
 *     tags:
 *       - commit
 *     summary: User별 commit 갯수 크롤링
 *     parameters:
 *       - username:
 *         $ref: '#/components/parameters/username'
 *       - startDate:
 *         $ref: '#/components/parameters/startDate'
 *     responses:
 *       SUCCESS:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     commits:
 *                       type : array
 *                       items: 
 *                          $ref: '#/components/schemas/Commit'
 *                   required:
 *                     - commits
 *               required:
 *                 - success
 *                 - data
 *       'ecode: 700':
 *         description: 서버 에러
 */

module.exports = router;