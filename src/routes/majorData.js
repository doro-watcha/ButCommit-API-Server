import { majorDataController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()


router.post('/', (req,res) => {
  majorDataController.create(req,res)
})

router.get('/:id' , (req,res) => {
  majorDataController.findOne(req,res)
})

router.get('/',authenticate, (req,res) => {
  majorDataController.findList(req,res)
})

router.patch('/:id', (req,res) => {
  majorDataController.update(req,res)
})

router.delete('/:id' , (req,res) => {
  majorDataController.delete(req,res)
})
 



/**
 * @swagger
 *
 * /majorData:
 *   get:
 *     tags:
 *       - majorData
 *     summary: 학과 정보 리스트 조회
 *     parameters:
 *       - year:
 *         $ref: '#/components/parameters/year'
 *       - majorId:
 *         $ref: '#/components/parameters/majorId'
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
 *                     majorData:
 *                       $ref: '#/components/schemas/MajorData'
 *                   required:
 *                     - majorData
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
 * /majorData/{id}:
 *   get:
 *     tags:
 *       - majorData
 *     summary: 학과 정보 id별 조회
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
 *                     majorData:
 *                       $ref: '#/components/schemas/MajorData'
 *                   required:
 *                     - majorData
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
 * /majorData:
 *   post:
 *     tags:
 *       - majorData
 *     summary: 학과 정보 생성
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: 년도
 *               metadata:
 *                 type: json
 *                 description: initialMember(초기모집인원), additionalMember(수시이월인원), competitionRate(경쟁률), reflectionSubject(반영과목), tamguNumber(탐구반영갯수), applicationIndicator( 반영지표), extraPoint( 가산점 )
 *               prediction:
 *                 type: json
 *                 description: strong(안정) , safe(적정), dangerous(위험), sniping(스나이핑)
 *               ratio:
 *                 type: json
 *                 description: korean, english , math, tamgu, foreign, history 과목 별 반영 비율
 *               gradeToScore:
 *                 type: json
 *                 description: 영어, 한국사 등급 별 점수환산 배열 ( way, score )
 *               majorId:
 *                 type: string
 *                 description: 관련 학과 id
 *             required:
 *               - year
 *               - majorId
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
 *                     majorData:
 *                       $ref: '#/components/schemas/MajorData'
 *                   required:
 *                     - majorData
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
 * /majorData/{id}:
 *   patch:
 *     tags:
 *       - majorData
 *     summary: 학과 정보 수정
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: 년도
 *               metadata:
 *                 type: json
 *                 description: initialMember(초기모집인원), additionalMember(수시이월인원), competitionRate(경쟁률), reflectionSubject(반영과목), tamguNumber(탐구반영갯수), applicationIndicator( 반영지표), extraPoint( 가산점 )
 *               prediction:
 *                 type: json
 *                 description: strong(안정) , safe(적정), dangerous(위험), sniping(스나이핑)
 *               ratio:
 *                 type: json
 *                 description: korean, english , math, tamgu, foreign, history 과목 별 반영 비율
 *               gradeToScore:
 *                 type: json
 *                 description: 영어, 한국사 등급 별 점수환산 배열 ( way, score )
 *               majorId:
 *                 type: string
 *                 description: 관련 학과 id
 *             required:
 *               - year
 *               - majorId
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
 *                     majorData:
 *                       $ref: '#/components/schemas/MajorData'
 *                   required:
 *                     - majorData
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
 * /majorData/{id}:
 *   delete:
 *     tags:
 *       - majorData
 *     summary: 학과 정보 삭제
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