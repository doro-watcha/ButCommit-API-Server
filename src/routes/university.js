
var express = require('express');

import { universityController } from '../controllers'


var router = express.Router();



router.post('/', (req,res) => {
    universityController.create(req,res)
})

router.get('/', function(req, res) {
    universityController.findList(req, res)
})

router.get('/:id' , function (req,res) {
    universityController.findOne(req,res)
})

router.get('/list/grade', function ( req, res )  {
    universityController.findGradeApplicationList(req,res)
})

router.patch('/:id', (req,res) => {
    universityController.update(req,res)
})

router.delete('/:id', (req,res) => {
    universityController.delete(req,res)
})




/**
 * @swagger
 *
 * /university:
 *   get:
 *     tags:
 *       - university
 *     summary: 대학 리스트 조회
 *     parameters:
 *       - location:
 *         $ref: '#/components/parameters/location'
 *       - group:
 *         $ref: '#/components/parameters/group'
 *       - line:
 *         $ref: '#/components/parameters/line'
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
 *                     university:
 *                       $ref: '#/components/schemas/University'
 *                   required:
 *                     - university
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
 * /university/{id}:
 *   get:
 *     tags:
 *       - university
 *     summary: 대학 id별 조회
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
 *                     university:
 *                       $ref: '#/components/schemas/University'
 *                   required:
 *                     - university
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
 * /university:
 *   post:
 *     tags:
 *       - university
 *     summary: 대학 정보 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 대학 이름
 *               min:
 *                 type: string
 *                 description: 지원 안정 최저 점수
 *               max:
 *                 type: integer
 *                 description: 지원 안정 최고 점수
 *               location:
 *                 type: string
 *                 description: 위치
 *               group:
 *                 type: string
 *                 description: 모집 군별
 *               line:
 *                 type: string
 *                 description: 인문/자연
 *             required:
 *               - name
 *               - min
 *               - max
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
 *                     university:
 *                       $ref: '#/components/schemas/University'
 *                   required:
 *                     - university
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
 * /university/{id}:
 *   patch:
 *     tags:
 *       - university
 *     summary: 대학 정보 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 대학 이름
 *               min:
 *                 type: string
 *                 description: 지원 안정 최저 점수
 *               max:
 *                 type: integer
 *                 description: 지원 안정 최고 점수
 *               location:
 *                 type: string
 *                 description: 위치
 *               group:
 *                 type: string
 *                 description: 모집 군별
 *               line:
 *                 type: string
 *                 description: 인문/자연
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
 *                     university:
 *                       $ref: '#/components/schemas/University'
 *                   required:
 *                     - university
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
 * /university/{id}:
 *   delete:
 *     tags:
 *       - university
 *     summary: 대학 정보 삭제
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

module.exports = router
