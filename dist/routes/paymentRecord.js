"use strict";

var _controllers = require("../controllers");

var _express = require("express");

var _Authenticator = _interopRequireDefault(require("../Authenticator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  authenticate,
  getUserInfo
} = _Authenticator.default;
const router = (0, _express.Router)();
const IMP = window.IMP;
IMP.init();
router.post('/', authenticate, (req, res) => {
  _controllers.paymentRecordController.create(req, res);
});
router.get('/', authenticate, (req, res) => {
  _controllers.paymentRecordController.findList(req, res);
});
router.get('/:id', authenticate, (req, res) => {
  _controllers.paymentRecordController.findOne(req, res);
});
router.patch('/:id', authenticate, (req, res) => {
  _controllers.paymentRecordController.update(req, res);
});
router.delete('/:id', authenticate, (req, res) => {
  _controllers.paymentRecordController.delete(req, res);
});
/**
 * @swagger
 *
 * /paymentRecord:
 *   get:
 *     tags:
 *       - paymentRecord
 *     security:
 *       - bearerAuth: []
 *     summary: 결제 기록 리스트 조회
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
 *                     paymentRecord:
 *                       $ref: '#/components/schemas/PaymentRecord'
 *                   required:
 *                     - paymentRecord
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
 * /paymentRecord/{id}:
 *   get:
 *     tags:
 *       - paymentRecord
 *     security:
 *       - bearerAuth: []
 *     summary: id별 결제 기록 조회
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
 *                     paymentRecord:
 *                       $ref: '#/components/schemas/PaymentRecord'
 *                   required:
 *                     - paymentRecord
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
 * /paymentRecord:
 *   post:
 *     tags:
 *       - paymentRecord
 *     security:
 *       - bearerAuth: []
 *     summary: 결제기록 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: 결제 금액
 *               userId:
 *                 type: integer
 *                 description: 유저 ID
 *               predictTimes:
 *                 type: integer
 *                 description: 예측 가능 횟수
 *             required:
 *               - amount
 *               - userId
 *               - predictTimes
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
 *                     paymentRecord:
 *                       $ref: '#/components/schemas/PaymentRecord'
 *                   required:
 *                     - paymentRecord
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
 * /paymentRecord/{id}:
 *   patch:
 *     tags:
 *       - paymentRecord
 *     security:
 *       - bearerAuth: []
 *     summary: 결제기록 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: 결제 금액
 *               userId:
 *                 type: integer
 *                 description: 유저 ID
 *               predictTimes:
 *                 type: integer
 *                 description: 예측 가능 횟수
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
 *                     paymentRecord:
 *                       $ref: '#/components/schemas/PaymentRecord'
 *                   required:
 *                     - paymentRecord
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
 * /paymentRecord/{id}:
 *   delete:
 *     tags:
 *       - paymentRecord
 *     security:
 *       - bearerAuth: []
 *     summary: 결제기록 삭제
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