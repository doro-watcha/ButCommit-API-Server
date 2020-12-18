import { reportDataController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()


router.post('/', (req,res) => {
  reportDataController.create(req,res)
})

router.get('/', (req,res) => {
  reportDataController.findList(req,res)
})

router.get('/:id' , (req,res) => {
  reportDataController.findOne(req,res)
})

router.patch('/:id', (req,res) => {
  reportDataController.update(req,res)
})


module.exports = router
