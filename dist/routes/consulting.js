"use strict";

var _express = require("express");

var _controllers = require("../controllers");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate
} = _Authenticator.default;
const router = new _express.Router();
router.post('/', (req, res) => {
  _controllers.consultingController.create(req, res);
});
router.get('/', authenticate, (req, res) => {
  _controllers.consultingController.findList(req, res);
});
router.get('/:id', authenticate, (req, res) => {
  _controllers.consultingController.findOne(req, res);
});
router.patch('/:id', authenticate, (req, res) => {
  _controllers.consultingController.update(req, res);
});
router.delete('/:id', authenticate, (req, res) => {
  _controllers.consultingController.delete(req, res);
});
/**
 * @swagger
 *
 * /consulting:
 *   get:
 *     tags:
 *       - consulting
 *     security:
 *       - bearerAuth: []
 *     summary: 상담 리스트 조회
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
 *                     consulting:
 *                       $ref: '#/components/schemas/Consulting'
 *                   required:
 *                     - consulting
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
 * /consulting/{id}:
 *   get:
 *     tags:
 *       - consulting
 *     summary: 상담 id 별 조회
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 상담 제목
 *               description:
 *                 type: string
 *                 description: 상담 내용
 *               userId:
 *                 type: integer
 *                 description: 상담 학생 id값
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
 *                     consulting:
 *                       $ref: '#/components/schemas/Consulting'
 *                   required:
 *                     - consulting
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
 * /consulting:
 *   post:
 *     tags:
 *       - consulting
 *     summary: 상담 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 상담 제목
 *               description:
 *                 type: string
 *                 description: 상담 내용
 *               userId:
 *                 type: integer
 *                 description: 유저 ID
 *             required:
 *               - title
 *               - description
 *               - userId
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
 *                     consulting:
 *                       $ref: '#/components/schemas/Consulting'
 *                   required:
 *                     - consulting
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
 * /consulting/{id}:
 *   patch:
 *     tags:
 *       - consulting
 *     summary: 상담 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 상담 제목
 *               description:
 *                 type: string
 *                 description: 상담 내용
 *               userId:
 *                 type: integer
 *                 description: 상담 학생 id값
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
 *                     consulting:
 *                       $ref: '#/components/schemas/Consulting'
 *                   required:
 *                     - consulting
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
 * /consulting/{id}:
 *   delete:
 *     tags:
 *       - consulting
 *     summary: 상담 삭제
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