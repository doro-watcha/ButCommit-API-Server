import { finalReportDataController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()


router.post('/', (req,res) => {
  finalReportDataController.create(req,res)
})

router.get('/', (req,res) => {
  finalReportDataController.findList(req,res)
})

router.get('/:id' , (req,res) => {
  finalReportDataController.findOne(req,res)
})

router.patch('/:id', (req,res) => {
  finalReportDataController.update(req,res)
})


module.exports = router
