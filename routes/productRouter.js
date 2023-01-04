const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const {upload} = require('../middleware/multerMiddleware')
const {requireLogin, adminMiddleware} = require('../middleware/authMiddleware')


router.post('/', requireLogin, adminMiddleware, upload.array('productPictures'), productController.createProduct)
router.get('/', productController.getAllProducts)
router.get('/category/:slug', productController.getProductsByCategorySlug)
router.get('/:id', productController.getProductDetail)
router.put('/:id', requireLogin, adminMiddleware, upload.array('productPictures'), productController.updateProduct)
router.delete('/:id', requireLogin, adminMiddleware, productController.deleteProduct)

module.exports = router