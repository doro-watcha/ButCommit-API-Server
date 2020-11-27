import { naesinController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()


router.post('/', (req,res) => {
  naesinController.create(req,res)
})

router.get('/', (req,res)=> {
  naesinController.findList(req,res)
})

router.get('/:id', (req,res) => {
  naesinController.findOne(req,res)
})


module.exports = router