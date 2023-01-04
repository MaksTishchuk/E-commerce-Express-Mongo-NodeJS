const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            default: '',
            trim: true, // Убирать пробелы
            min: 3,
            max: 20
        },
        lastName: {
            type: String,
            default: '',
            trim: true,
            min: 3,
            max: 20
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        hashPassword: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        contactNumber: {type: String, default: ''},
        profilePicture: {type: String, default: ''}
    },
    {timestamps: true}
)

// userSchema.virtual('password').set((password) => {
//     this.hashPassword = bcrypt.hashSync(password, 10)
// });

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
});

userSchema.methods.authenticate = async function (password) {
    return await bcrypt.compare(password, this.hashPassword)
};

module.exports = mongoose.model("User", userSchema)