var express = require('express');
var router = express.Router();

import universityRouter from './university'
import scoreRouter from './score'
import authRouter from './auth'
import userRouter from './user'
import reportRouter from './report'
import majorRouter from './major'
import consultingRouter from './consulting'
import paymentRecordRouter from './paymentRecord'
import academyRouter from './academy'
import fileRouter from './file'
import majorDataRouter from './majorData'
import testRouter from './test'
import highestScoreRouter from './highestScore'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/university', universityRouter)
router.use('/score', scoreRouter)
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/report', reportRouter)
router.use('/major', majorRouter)
router.use('/consulting', consultingRouter)
router.use('/paymentRecord', paymentRecordRouter)
router.use('/academy', academyRouter)
router.use('/file' , fileRouter)
router.use('/majorData', majorDataRouter)
router.use('/test', testRouter)
router.use('/highestScore', highestScoreRouter)


module.exports = router