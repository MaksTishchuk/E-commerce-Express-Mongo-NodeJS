const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")


const generateJwtToken = (_id, email, role) => {
    return jwt.sign(
        {_id, email, role},
        process.env.jwtSecret,
        {expiresIn: "8h"}
    )
}

const registerUser = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email})
        if (user) return res.status(400).json({error: "User with this email already registered!"})
        const {email, username, password} = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        let newUser = new User({
            email,
            username,
            hashPassword
        })
        await newUser.save((error, user) => {
            if (error) return res.status(400).json({message: "Can`t save User!"})
            if (user) {
                const token = generateJwtToken(user._id, user.email, user.role)
                return res.status(201).json({token: token, user: user})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email}).select('-__v')
        if (!user) return res.status(404).json({error: "User with this credentials was not found!"})
        const isPassword = await user.authenticate(req.body.password)
        if (isPassword && user.role === "user") {
            const token = generateJwtToken(user._id, user.email, user.role)
            res.status(200).json({
                token: token,
                user: user,
                fullName: user.fullName
            })
        } else return res.status(404).json({error: "User with this credentials was not found!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    registerUser, loginUser
}
