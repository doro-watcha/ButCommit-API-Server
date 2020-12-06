import { Router } from 'express'
import { autoTransitionController } from '../controllers'
import Authenticator from '../Authenticator'
import multer from 'multer'
import path from 'path'

const { authenticate } = Authenticator

const router = new Router()

const upload_file = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "autoTransition" + path.extname(file.originalname))
    },
  }),
})


router.post('/', authenticate,  (req,res) => {
  autoTransitionController.create(req,res)
})


router.post('/file' ,upload_file.fields([{ name: 'excel', maxCount: 1 }]),  ( req,res) => {
  autoTransitionController.uploadFile(req,res)
})

router.get('/parse',( req,res) => {
  autoTransitionController.parseFile(req,res)
})

router.get('/', (req,res) => {
  autoTransitionController.findOne(req,res)
})

module.exports = router