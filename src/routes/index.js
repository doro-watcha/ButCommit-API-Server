var express = require('express');
var router = express.Router();

import commitRouter from './commit'
import userRouter from './user'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/commit', commitRouter)
router.use('/user', userRouter)



module.exports = router