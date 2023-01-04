const Router = require('express')
const router = Router()
const authRouter = require('./authRouter')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const addressRouter = require('./addressRouter')
const orderRouter = require('./orderRouter')
const indexAdmin = require('./admin/indexAdmin')


router.use('/user', authRouter)
router.use('/admin', indexAdmin)
router.use('/categories', categoryRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/address', addressRouter)
router.use('/orders', orderRouter)

module.exports = router
