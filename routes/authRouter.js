const express = require('express')
const router = express.Router()
const userController = require('../controllers/authController')
const validators = require('../validators/authValidator')


router.post('/registration', validators.validateRegister, validators.isValidated, userController.registerUser)
router.post('/login', validators.validateLogin, validators.isValidated, userController.loginUser)

module.exports = router