const Router = require('express')
const router = Router()
const authAdminRouter = require('./authAdminRouter')
const initialDataRouter = require('./initialDataRouter')
const categoryPageRouter = require('./categoryPageRouter')
const orderRouter = require('./orderRouter')


router.use('/auth', authAdminRouter)
router.use('/initial-data', initialDataRouter)
router.use('/pages', categoryPageRouter)
router.use('/orders', orderRouter)

module.exports = router
