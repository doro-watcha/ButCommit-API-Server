import { scoreTransitionController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()


router.post('/', (req,res) => {
  scoreTransitionController.create(req,res)
})
router.get('/',  (req,res) => {
  scoreTransitionController.findOne(req,res)
})

module.exports = router 