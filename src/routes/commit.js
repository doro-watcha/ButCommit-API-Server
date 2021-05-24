
import { Router } from 'express'
import { commitController } from '../controllers'
import Authenticator from '../Authenticator'

const { authenticate } = Authenticator

const router = new Router()


router.get('/', (req,res) => {
  commitController.crawl(req,res)
})

module.exports = router
