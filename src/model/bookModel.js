const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        requried: true,
        unique: true,
        trim:true
    },
    excerpt: {
        type: String,
        requried: true,
        trim:true
    },
    userId:{
        type : objectId,
        ref : "User",
        required: true
    },
    ISBN: {
        type: String,
        requried: true,
        unique: true
    },
    category: {
        type: String,
        requried: true,
        trim:true
    },
    subcategory: [{
        type: String,
        required: true,
        trim:true
    }],
    reviews:{
        type: Number,
        default: 0,
    },
    isDeleted:{
        type : Boolean,
        default: false
    },
    deletedAt:{
        type: Date,
        default : null
    },
    
    releasedAt:{
        type: Date,
        requried: true
    }
  
},{ timestamps: true })


module.exports =mongoose.model("Book",bookSchema)