import { Router } from 'express'
import { gradeCutController } from '../controllers'
import multer from 'multer'
import path from 'path'

const router = new Router()


const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, '../excelfile/');
    },
    // convert a file nameww
    filename: (req, file, cb) => {
      cb(null, "gradeCut" + path.extname(file.originalname))
    },
  }),
})



router.get('/',  (req,res) => {
  gradeCutController.findOne(req,res)
})

router.get('/parse', (req,res) => {
  gradeCutController.parse(req,res)
})

router.post('/file', upload.fields([{name:'excel', maxCount : 1}]), (req,res) => {
  gradeCutController.upload(req,res)
})


module.exports = router 