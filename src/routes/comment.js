import { Router } from 'express'
import { commentController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', authenticate,  (req,res) => {
  commentController.create(req,res)
})


router.get('/' , ( req,res) => {
  commentController.findList(req,res)
})

router.get('/:id', (req,res) => {
  commentController.findOne(req,res)
})

router.patch('/:id', (req,res) => {
  commentController.update(req,res)
})

router.delete('/:id', (req,res)=> {
  commentController.delete(req,res)
})


module.exports = router