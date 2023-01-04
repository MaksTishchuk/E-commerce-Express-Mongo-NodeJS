const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const {requireLogin} = require('../middleware/authMiddleware')


router.post('/', requireLogin, orderController.createOrder)
router.get('/', requireLogin, orderController.getAllOrders)
router.get('/:id', requireLogin, orderController.getOrderDetail)

module.exports = router