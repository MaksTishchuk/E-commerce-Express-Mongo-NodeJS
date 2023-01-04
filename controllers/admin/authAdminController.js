const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../../models/userModel")


const registerAdmin = async (req, res) => {
    try {
        let admin = await User.findOne({email: req.body.email})
        if (admin) return res.status(400).json({error: "Admin with this credentials already registered!"})
        const {email, username, password} = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        let newAdmin = new User({
            email,
            username,
            hashPassword,
            role: "admin"
        })
        await newAdmin.save((error, admin) => {
            if (error) return res.status(400).json({message: "Can`t save Admin!"})
            if (admin) {
                return res.status(201).json({message: 'Admin has been created!', admin: admin})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

const loginAdmin = async (req, res) => {
    try {
        let admin = await User.findOne({email: req.body.email}).select('-__v')
        if (!admin) return res.status(404).json({error: "User with this credentials was not found!"})
        const isPassword = await admin.authenticate(req.body.password)
        if (isPassword && admin.role === "admin") {
            const token = jwt.sign(
                {_id: admin._id, email: admin.email, role: admin.role},
                process.env.jwtSecret,
                {expiresIn: "1d"}
            );
            res.cookie("token", token, { expiresIn: "1d" });
            res.status(200).json({
                token: token,
                admin: admin,
            })
        } else return res.status(404).json({error: "Admin with this credentials was not found!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({message: "Logout admin successfully!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!", error: error.message})
    }
}

module.exports = {
    registerAdmin, loginAdmin, logoutAdmin
}
