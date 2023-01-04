const UserAddress = require("../models/addressModel")
const mongoose = require("mongoose");


const addNewAddress = async (req, res) => {
    try {
        const {fullName, mobilePhone, country, city, zipCode, address} = req.body

        const newAddress = new UserAddress({
            user: req.user._id,
            fullName: fullName,
            mobilePhone: mobilePhone,
            country: country,
            city: city,
            zipCode: zipCode,
            address: address,
        })

        await newAddress.save((error, newAddress) => {
            if (error) return res.status(400).json({
                message: "Can`t save new address!",
                error: error.message
            })
            if (newAddress) {
                return res.status(201).json({
                    message: 'Address has been created!',
                    newAddress: newAddress
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getAllAddresses = async (req, res) => {
    try {
        const addresses = await UserAddress.find({user: req.user._id}).populate(
            {path: 'user', select: '_id firstName lastName username email'}
        )
        if (!addresses) {
            return res.status(500).json({success: false, message: 'Addresses were not found!'})
        }
        res.status(200).json(addresses)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOneAddress = async (req, res) => {
    try {
        const addressId = req.params.id
        if (addressId) {
            const address = await UserAddress.findById(addressId).populate(
            {path: 'user', select: '_id firstName lastName username email'}
        )
            if (!address) {
                return res.status(500).json({success: false, message: 'Address was not found!'})
            }
            res.status(200).json(address)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateAddress = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({
                success: false,
                message: 'Address with this ID was not found!'
            })
        }

        const {fullName, mobilePhone, country, city, zipCode, address} = req.body
        const updatedAddress = await UserAddress.findByIdAndUpdate(
            req.params.id,
            {
                user: req.user._id,
                fullName,
                mobilePhone,
                country,
                city,
                zipCode,
                address
            },
            {new: true}
        )
        if (!updatedAddress) {
            return res.status(500).json({success: false, message: 'Address was not updated!'})
        }
        res.status(200).json(updatedAddress)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteAddress = async (req, res) => {
    try {
        UserAddress.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Address was not found!'})
            }
            res.json({success: true, message: 'Address was deleted!', doc: doc})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    addNewAddress, getAllAddresses, getOneAddress, updateAddress, deleteAddress,
}