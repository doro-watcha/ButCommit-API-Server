
import { Router } from 'express'
import { userController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', (req,res) => {
  userController.register(req,res)
})

router.patch('/', (req,res) => {
  userController.update(req,res)
})

module.exports = router 



