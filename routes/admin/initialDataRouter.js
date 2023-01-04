const express = require('express')
const router = express.Router()
const initialDataController = require('../../controllers/admin/initialDataController')
const {requireLogin, adminMiddleware} = require('../../middleware/authMiddleware')


router.get('', requireLogin, adminMiddleware, initialDataController.initialData)

module.exports = router