import { Router } from 'express'
import { authController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.get('/', authenticate, (req, res) => {
	authController.token(req, res)
})


router.post('/signup', (req, res) => {
	authController.signUp(req, res)
})


router.post('/signin', (req, res) => {
	authController.signIn(req, res)
})

router.get('/admin', authenticate, (req,res) => {
	authController.getAdminLevel(req,res)
})

router.post('/fuck', (req,res) => {
	authController.fuck(req,res)
})



/**
 * @swagger
 *
 * /auth:
 *   get:
 *     tags:
 *       - auth
 *     security:
 *       - bearerAuth: []
 *     summary: 토큰 확인 (자동 로그인)
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
 *       'ecode: 700':
 *         description: 서버 에러
 */


/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     tags:
 *      - auth
 *     summary: 이메일 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: 8-20 문자, 숫자, 특수문자(!@#$%^&) 조합, (영문자, 숫자, 특수문자는 반드시 1개 이상 포함)
 *               name:
 *                 type: string
 *                 description: 유저 이름
 *               highSchool:
 *                 type: string
 *                 description: 고등학교 이름 
 *               line:
 *                 type: string
 *                 description: 문/이과
 *               graduateYear:
 *                 type: integer
 *                 description: 졸업년도
 *               haknyeon:
 *                 type: string
 *                 description: 학년
 *               predictTimes:
 *                 type: integer
 *                 description: 예측 가능 횟수
 *               gender:
 *                 type: string
 *                 description: 성별
 *               telephone:
 *                 type: integer
 *                 description: 전화번호
 *               academyId:
 *                 type: integer
 *                 description: 학원 id
 *             required:
 *               - email
 *               - password
 *               - name
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
 *               required:
 *                 - success
 *                 - data
 *       'ecode: 100':
 *         description: Request Body Validation 실패
 *       'ecode: 500':
 *         description: 이미 존재하는 이메일일 경우
 *       'ecode: 700':
 *         description: 서버 에러
 */


/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     summary: 이메일 로그인
 *     tags:
 *      - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: 8-20 문자, 숫자, 특수문자(!@#$%^&) 조합, (영문자, 숫자, 특수문자는 반드시 1개 이상 포함)
 *             required:
 *               - email
 *               - password
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
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnb2Rkb3JvQG5hdmVyLmNvbSIsImlhdCI6MTU5Mzg3NDE4NCwiZXhwIjoxNTk5MDU4MTg0fQ.GxyJn0tqpsUApxOrpr-0d9gH3LR3fCQi0riIgsu38OQ
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                   required:
 *                     - token
 *                     - user
 *               required:
 *                 - success
 *                 - data
 *       'ecode: 100':
 *         description: Request Body Validation 실패
 *       'ecode: 200':
 *         description: 비밀번호가 틀릴 경우
 *       'ecode: 402':
 *         description: 가입되지 않은 이메일로 로그인할 경우
 *       'ecode: 700':
 *         description: 서버 에러
 */

module.exports = router