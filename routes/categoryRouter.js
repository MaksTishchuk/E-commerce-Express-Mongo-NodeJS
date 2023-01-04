const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const {upload} = require('../middleware/multerMiddleware')
const {requireLogin, adminMiddleware} = require('../middleware/authMiddleware')


router.post('/', requireLogin, adminMiddleware, upload.single('categoryImage'), categoryController.createCategory)
router.get('/', categoryController.getCategories)
router.get('/:slug', categoryController.getCategory)
router.put('/:slug', requireLogin, adminMiddleware, upload.single('categoryImage'), categoryController.updateCategory)
router.delete('/:slug', requireLogin, adminMiddleware, categoryController.deleteCategory)

module.exports = router