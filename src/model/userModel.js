const mongoose = requrie("mongoose")

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        requried: true,
        enum: [Mr, Mrs, Miss]
    },
    name: {
        type: String,
        requried: true
    },
    phone: {
        type: String,
        requried: true,
        unique: true
    },
    email: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        requried: true
    },
    address: {
        street: { type : String },
        city: { type : String },
        pincode: { type: String }
    }

}, { timestamp: true })
module.exports = mongoose.model('User', userSchema)
