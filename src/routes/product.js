import { productController } from '../controllers'
import { Router } from 'express'

import Authenticator from '../Authenticator'

const { authenticate, getUserInfo } = Authenticator

const router  = Router()



router.post('/', (req, res) => {
  productController.create(req,res)
})


module.exports = router