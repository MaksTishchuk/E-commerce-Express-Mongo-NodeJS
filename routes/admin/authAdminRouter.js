const express = require('express')
const router = express.Router()
const authAdminController = require('../../controllers/admin/authAdminController')
const validators = require('../../validators/authValidator')


router.post('/registration', validators.validateRegister, validators.isValidated, authAdminController.registerAdmin)
router.post('/login', validators.validateLogin, validators.isValidated, authAdminController.loginAdmin)
router.post('/logout', authAdminController.logoutAdmin)

module.exports = router