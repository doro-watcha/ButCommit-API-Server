import { Router } from 'express'
import { finalReportController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.post('/', authenticate,  (req,res) => {
  finalReportController.create(req,res)
})


router.get('/' , authenticate, ( req,res) => {
  finalReportController.findList(req,res)
})

router.get('/:id', authenticate,  (req,res) => {
  finalReportController.findOne(req,res)
})

router.delete('/:id', authenticate, (req,res)=> {
  finalReportController.delete(req,res)
})


module.exports = router