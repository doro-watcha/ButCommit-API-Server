"use strict";

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate,
  getUserInfo
} = _Authenticator.default;

var router = _express.default.Router();

const upload = (0, _multer.default)({
  storage: _multer.default.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../file/');
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, "major" + _path.default.extname(file.originalname));
    }
  })
});
router.get('/', (req, res) => {
  _controllers.majorController.findList(req, res);
});
router.get('/:id', (req, res) => {
  _controllers.majorController.findOne(req, res);
});
router.get('/list/internal', authenticate, (req, res) => {
  _controllers.majorController.findInternalMajorList(req, res);
});
router.post('/', (req, res) => {
  _controllers.majorController.create(req, res);
});
router.patch('/:id', (req, res) => {
  _controllers.majorController.update(req, res);
});
router.delete('/:id', (req, res) => {
  _controllers.majorController.delete(req, res);
});
/**
 * @swagger
 *
 * /major:
 *   get:
 *     tags:
 *       - major
 *     summary: 학과 리스트 조회
 *     parameters:
 *       - group:
 *         $ref: '#/components/parameters/group'
 *       - line:
 *         $ref: '#/components/parameters/line'
 *       - location:
 *         $ref: '#/components/parameters/location'
 *       - recruitmentType:
 *         $ref: '#/components/parameters/recruitmentType'
 *       - recruitmentUnit:
 *         $ref: '#/components/parameters/recruitmentUnit'
 *       - univName:
 *         $ref: '#/components/parameters/univName'
 *       - majorName:
 *         $ref: '#/components/parameters/majorName'
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
 *                     major:
 *                       $ref: '#/components/schemas/Major'
 *                   required:
 *                     - major
 *               required:
 *                 - success
 *                 - data
 *       'ecode: 201':
 *         description: 유효하지 않은 토큰
 *       'ecode: 100':
 *         description: Request Body Validation 실패
 *       'ecode: 700':
 *         description: 서버 에러
 */

/**
* @swagger
*
* /major/{id}:
*   get:
*     tags:
*       - major
*     summary: 학과 id 별 조회
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
*                     major:
*                       $ref: '#/components/schemas/Major'
*                   required:
*                     - major
*               required:
*                 - success
*                 - data
*       'ecode: 201':
*         description: 유효하지 않은 토큰
*       'ecode: 100':
*         description: Request Body Validation 실패
*       'ecode: 700':
*         description: 서버 에러
*/

/**
 * @swagger
 *
 * /major:
 *   post:
 *     tags:
 *       - major
 *     summary: 학과 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               group:
 *                 type: string
 *                 description: 모집 군별
 *               line:
 *                 type: string
 *                 description: 인문/자연/예체능
 *               location:
 *                 type: string
 *                 description: 예측 가능 횟수
 *               recruitmentType:
 *                 type: string
 *                 description: 모집 전형
 *               recruitmentUnit:
 *                 type: string
 *                 description: 모집 단위
 *               univName:
 *                 type: string
 *                 description: 대학 이름
 *               majorName:
 *                 type: string
 *                 description: 세부 전공 이름
 *             required:
 *               - group
 *               - line
 *               - location
 *               - recruitmentType
 *               - recruitmentUnit
 *               - univName
 *               - majorName
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
 *                     major:
 *                       $ref: '#/components/schemas/Major'
 *                   required:
 *                     - major
 *               required:
 *                 - success
 *                 - data
 *       'ecode: 201':
 *         description: 유효하지 않은 토큰
 *       'ecode: 100':
 *         description: Request Body Validation 실패
 *       'ecode: 700':
 *         description: 서버 에러
 */

/**
* @swagger
*
* /major/{id}:
*   patch:
*     tags:
*       - major
*     summary: 학과 수정
*     requestBody:
*       required: true
*       content:
*         application/x-www-form-urlencoded:
*           schema:
*             type: object
*             properties:
*               group:
*                 type: string
*                 description: 모집 군별
*               line:
*                 type: string
*                 description: 인문/자연/예체능
*               location:
*                 type: string
*                 description: 예측 가능 횟수
*               recruitmentType:
*                 type: string
*                 description: 모집 전형
*               recruitmentUnit:
*                 type: string
*                 description: 모집 단위
*               univName:
*                 type: string
*                 description: 대학 이름
*               majorName:
*                 type: string
*                 description: 세부 전공 이름
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
*                     major:
*                       $ref: '#/components/schemas/Major'
*                   required:
*                     - major
*               required:
*                 - success
*                 - data
*       'ecode: 201':
*         description: 유효하지 않은 토큰
*       'ecode: 100':
*         description: Request Body Validation 실패
*       'ecode: 700':
*         description: 서버 에러
*/

/**
* @swagger
*
* /major/{id}:
*   delete:
*     tags:
*       - major
*     summary: 학과 삭제
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
*               required:
*                 - success
*       'ecode: 201':
*         description: 유효하지 않은 토큰
*       'ecode: 100':
*         description: Request Body Validation 실패
*       'ecode: 700':
*         description: 서버 에러
*/

module.exports = router;