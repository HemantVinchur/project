const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
    fullName: String,
    email: String,
    contact: Number,
    password: String,
    state: String,
    salt: String,
    otp: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('userSchema', userSchema)