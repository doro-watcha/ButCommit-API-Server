import { Router } from 'express'
import { highestScoreController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/' , (req,res) => {
  highestScoreController.create(req,res)
})

module.exports = router