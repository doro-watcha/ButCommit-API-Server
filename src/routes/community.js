import { Router } from 'express'
import { communityController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', authenticate,  (req,res) => {
  communityController.create(req,res)
})


router.get('/' , ( req,res) => {
  communityController.findList(req,res)
})

router.get('/:id', (req,res) => {
  communityController.findOne(req,res)
})

router.patch('/:id', (req,res) => {
  communityController.update(req,res)
})

router.delete('/:id', (req,res)=> {
  communityController.delete(req,res)
})


module.exports = router