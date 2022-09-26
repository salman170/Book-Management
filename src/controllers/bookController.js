const bookModel = require('../model/bookModel')
const userModel = require("../model/userModel")
const reviewModel = require("../model/reviewModel")
const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Types.ObjectId.isValid




//<=======================Create Book API=================================>

//need to work on releasedAt
const createBook = async function (req, res) {
    try {

        let data = req.body;
        
        let { title, userId, ISBN } = data;

        let checktitle = await bookModel.findOne({ title: title })
        if (checktitle) return res.status(400).send({ status: false, message: "This title is already taken" })

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN Already Exists" })

        let user = await userModel.findById({ _id: userId })
        if (!user) return res.status(404).send({ status: false, message: "No such user exist" })

        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: savedData })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//<----------------------Get Books API --------------------->
const books = async function (req, res) {
    try {
        let queries = req.query

        if (Object.keys(queries).length == 0) {
            let bookList = await bookModel.find({ isDeleted: false }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0, createdAt:0, updatedAt:0 }).sort("title")

            if (bookList.length == 0) return res.status(404).send({ status: false, message: "No data found" })

            return res.status(200).send({ status: true, message: "list of Books", data: bookList })
        }

        const { userId, category, subcategory, ...rest } = req.query

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not get for these:-( ${Object.keys(rest)} ) data ` })

        const filter = { isDeleted: false }

        if (userId) {
            if (userId == undefined || userId.trim() == "") {
                return res.status(404).send({ status: false, message: "please give value of filter" })
            }

            if (!ObjectId(userId.trim())) { return res.status(400).send({ status: false, message: "Invalid UserId" }) }
            filter.userId = userId.trim()
        }

        if (category) {
            if (category == undefined || category.trim() == "") {
                return res.status(404).send({ status: false, message: "please give value of filter category" })
            }
            filter.category = category.trim()
        }
        if (subcategory) {
            if (subcategory == undefined || subcategory.trim() == "") {
                return res.status(404).send({ status: false, message: "please give value of filter Subcategory" })
            }
            filter.subcategory = subcategory.trim()
        }

        console.log(filter);

        let bookList = await bookModel.find(filter).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0 }).sort("title")

        if (bookList.length == 0) return res.status(404).send({ status: false, message: "No data found" })


        return res.status(200).send({ status: true, message: "list of Books", data: bookList })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }


}


//<=======================Get Book by bookId API=================================>

const getParticularBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!ObjectId(bookId)) return res.status(400).send({ status: false, message: " Invalid bookId" })

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, ISBN: 0, deletedAt: 0 })

        if (!book) return res.status(404).send({ status: false, message: "Book is not found" })

        reviewsData = await reviewModel.find({ bookId: bookId }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        let obj = book._doc
        obj["reviewsData"] = reviewsData
        res.status(200).send({ status: true, message: "Book list", data: obj })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


//<=======================Update Book by bookId API=================================>
const updateBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        const body = req.body;

        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "please enter require data to create Book" })
        
        let { title, excerpt, releasedAt, ISBN, ...rest } = req.body

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not update these:-( ${Object.keys(rest)} ) data ` })

        const filter = { isDeleted: false }

        if (title) {
            if (title == undefined || title.trim() == "")
                return res.status(404).send({ status: false, message: "please give value of filter" })
            if (typeof (title) !== "string")
                return res.status(400).send({ status: false, message: "Title will be in string format only" })

            let checkTitle = await bookModel.findOne({ title: title });

            if (checkTitle)
                return res.status(400).send({ status: false, message: " Title is already exist, Enter new book name...!" })
            filter.title = title.trim()
        }

        if (excerpt) {
            if (excerpt == undefined || excerpt.trim() == "")
                return res.status(404).send({ status: false, message: "please give value of filter" })
            if (!/^[a-zA-Z \s]+$/.test(excerpt))
                return res.status(400).send({ status: false, message: "Please Enter Only Alphabets in excerpt" })
            filter.excerpt = excerpt.trim()
        }

        if (ISBN) {
            if (!/^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))
                return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit e.g 978-0-596-52068-7)' })

            let checkISBN = await bookModel.findOne({ ISBN: ISBN })
            if (checkISBN)
                return res.status(400).send({ status: false, message: "ISBN Already Exists" })
            filter.ISBN = ISBN
        }

        if (releasedAt) {
            let date = moment.utc(releasedAt, "YYYY-MM-DD", true)
            if (!date.isValid())
                return res.status(400).send({ status: false, message: "Enter Date in valid format eg. (YYYY-MM-DD)...!" })
            filter.releasedAt = date
        }

        const updateBook = await bookModel.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { $set: filter },
            { new: true })
        if (updateBook === null) return res.status(404).send({ status: false, message: "No such book found...!" })
        res.status(200).send({ Status: true, message: "Success", Data: updateBook })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//<=======================Delete Book by bookId API=================================>
const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "No data found" })

        let deletedBook = await bookModel.findByIdAndUpdate({ _id: bookId },
            { $set: { isDeleted: true, deletedAt: new Date() } })

        res.status(200).send({ status: true, message: "Book is successfully deleted" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createBook, getParticularBook, books, updateBookById, deleteBookById }