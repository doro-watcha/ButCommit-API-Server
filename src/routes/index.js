var express = require('express');
var router = express.Router();

import commitRouter from './commit'


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/commit', commitRouter)



module.exports = router