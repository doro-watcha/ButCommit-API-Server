
import { Router } from 'express'
import { groupController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', (req,res) => {
  groupController.create(req,res)
})

module.exports = router