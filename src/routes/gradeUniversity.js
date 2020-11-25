import { Router } from 'express'
import { gradeUniversityController } from '../controllers'

const router = new Router()


router.get('/',  (req,res) => {
  gradeUniversityController.findList(req,res)
})


module.exports = router 