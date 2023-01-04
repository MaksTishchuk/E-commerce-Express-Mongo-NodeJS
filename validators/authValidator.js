const { check, validationResult } = require('express-validator')


const validateRegister = [
    check('email').isEmail().withMessage('Invalid Email!'),
    check('username').isLength({min: 3, max: 30}).withMessage('Username length must be between 3 and 30 symbols!'),
    check('password').isLength({min: 6}).withMessage('Password length must be 6 or more symbols!')
]

const validateLogin = [
    check('email').isEmail().withMessage('Invalid Email!'),
    check('password').isLength({min: 6}).withMessage('Password length must be 6 or more symbols!')
]

const isValidated = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

module.exports = { validateRegister, validateLogin, isValidated }
