const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/admin/orderController')
const {requireLogin, adminMiddleware} = require('../../middleware/authMiddleware')


router.get('/', requireLogin, adminMiddleware, orderController.getAllOrders)
router.get('/:id', requireLogin, adminMiddleware, orderController.getDetailOrder)
router.put('/:id', requireLogin, adminMiddleware, orderController.updateOrder)

module.exports = router