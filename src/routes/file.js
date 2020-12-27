import { Router } from 'express'
import { fileController } from '../controllers'
import Authenticator from '../Authenticator'
import multer from 'multer'
import path from 'path'

const { authenticate } = Authenticator

const router = new Router()

const upload_major = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "tomato" + path.extname(file.originalname))
    },
  }),
})

const upload_university = multer({
  storage : multer.diskStorage({
    destination : (req,file,cb) => {
    cb(null, '../excelfile/')
    },
    filename: (req,file,cb) => {
      cb(null, "university" + path.extname(file.originalname))
    },
  }),
})

/**
 * 학과 정보 관련 File Upload / Download / Delete / Parsing
 */
router.post('/upload' , upload_major.fields([{ name: 'excel', maxCount: 1 }]), (req,res) => {
  fileController.upload(req,res)
})

router.get('/major', (req,res) => {
  fileController.downloadMajor(req,res)
})

router.delete('/major', (req,res) => {
  fileController.deleteMajor(req,res)
})

router.get('/parse' , (req,res) => {
  fileController.parse(req,res)
})

/**
 * 대학 정보 관련 File Upload / Download/ Delete / Parsing
 */


router.post('/university', upload_university.fields([{name:'excel', maxCount : 1}]), (req,res) => {
  fileController.uploadUniv(req,res)
})

router.get('/university', (req,res) => {
  fileController.downloadUniv(req,res)
})

router.delete('/university', (req,res) => {
  fileController.deleteUniv(req,res)
})

router.get('/university/parse' , (req,res) => {
  fileController.parseUniv(req,res)
})


module.exports = router