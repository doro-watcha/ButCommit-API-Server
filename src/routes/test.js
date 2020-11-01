
var express = require('express');
import multer from 'multer'
import path from 'path'
import { testController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator


var router = express.Router();

const upload_test = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "test" + path.extname(file.originalname))
    },
  }),
})

router.get('/file',  (req,res) => {
  testController.downloadFile(req,res)
})

router.post('/file', upload_test.fields([{ name: 'excel', maxCount: 1 }]) , (req,res) => {

  testController.uploadFile(req,res)
})

router.get('/parse', (req,res) => {
  testController.parse(req,res)
})

router.get('/', (req,res) => {
    testController.test(req,res)
})

router.get('/list', (req,res) => {
  testController.getList(req,res)
})


module.exports = router
