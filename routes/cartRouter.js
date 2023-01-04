const express = require('express')
const router = express.Router()
const {requireLogin} = require('../middleware/authMiddleware')
const cartController = require('../controllers/cartController')

router.post('/add-to-cart', requireLogin, cartController.addItemToCart)
router.get('/get-cart-items', requireLogin, cartController.getCartItems)
router.delete('/:productId', requireLogin, cartController.deleteItemFromCart)

module.exports = router