const mongoose = require('mongoose')


const userAddressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 100,
        },
        mobilePhone: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
            min: 10,
            max: 100,
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("UserAddress", userAddressSchema);