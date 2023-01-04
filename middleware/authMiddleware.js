const jwt = require('jsonwebtoken')

exports.requireLogin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const user = jwt.verify(token, process.env.jwtSecret)
        req.user = user
    } else {
        return res.status(400).json({message: "Access denied! You need login!"});
    }
    next()
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({message: "Access denied!"})
    }
    next()
}

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({message: "Access denied!"})
    }
    next()
}

exports.superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== 'super-admin') {
        return res.status(400).json({message: "Access denied!"})
    }
    next()
}