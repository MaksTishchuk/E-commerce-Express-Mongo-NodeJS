const express = require('express')
const router = express.Router()
const categoryPageController = require('../../controllers/admin/categoryPageController')
const {upload} = require('../../middleware/multerMiddleware')
const {requireLogin, adminMiddleware} = require('../../middleware/authMiddleware')


router.post(
    '',
    requireLogin,
    adminMiddleware,
    upload.fields([
        {name: 'banners'},
        {name: 'products'}
    ]),
    categoryPageController.createPage
)

router.get('/:category', requireLogin, adminMiddleware, categoryPageController.getPage)

module.exports = router