
import { Router } from 'express'
import { commitController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.get('/', (req,res) => {
  commitController.crawl(req,res)
})

router.get('/check', (req,res) => {
  commitController.check(req,res)
})




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




module.exports = router
