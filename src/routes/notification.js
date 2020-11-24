import { Router } from 'express'
import { notificationController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', authenticate,  (req,res) => {
  notificationController.create(req,res)
})


router.get('/' , ( req,res) => {
  notificationController.findList(req,res)
})

router.get('/:id', (req,res) => {
  notificationController.findOne(req,res)
})

router.patch('/:id', (req,res) => {
  notificationController.update(req,res)
})

router.delete('/:id', (req,res)=> {
  notificationController.delete(req,res)
})


module.exports = router