const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Type.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        required: true,
        refs: "Book"
    },

    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim:true
    },

    reviewedAt: {
        type: Date,
        required: true
    },

    rating: {
        type: Number,
        default: 1,
        required: true
        //  min 1, max 5, 
    },

    review: {
        type: String,
        trim:true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamp: true })

module.exports = mongoose.model('Review', reviewSchema)
