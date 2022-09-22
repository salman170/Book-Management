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
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter require data to create Book" })
        }
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, isDeleted } = data;

        if (!title) {
            return res.status(400).send({ status: false, msg: "Title is mandatory" })
        }
        if (typeof (title) !== "string") {
            return res.status(400).send({ status: false, msg: "Title will be in string format only" })
        }
        let checktitle = await bookModel.findOne({ title: title })

        if (checktitle) {
            return res.status(400).send({ status: false, message: "This title is already taken" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "Excerpt is mandatory" })
        }
        if (!/^[a-zA-Z \s]+$/.test(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in excerpt" })
        }
        if (!userId) {
            return res.status(400).send({ status: false, msg: "UserId is mandatory" })
        }
        if (!ObjectId(userId)) { return res.status(400).send({ status: false, msg: "userId is not in format" }) }

        let user = await userModel.findById({ _id: userId })

        if (!user) {
            return res.status(404).send({ status: false, msg: "No such user exist" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is mandatory" })
        }
        if (!/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit e.g 978-0-596-52068-7)' })
        }

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })

        if (checkISBN) {
            return res.status(400).send({ status: false, message: "ISBN Already Exists" })
        }

        if (!(category.trim())) {
            return res.status(400).send({ status: false, msg: "Category is mandatory" })
        }
        if (!/^[a-zA-Z \s]+$/.test(category)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in Category" })
        }

        if (!(subcategory.trim())) {
            return res.status(400).send({ status: false, msg: "Subcategory is mandatory" })
        }
        if (!/^[a-zA-Z \s]+$/.test(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please Enter Only Alphabets in subcategory" })
        }

        if (reviews) {
            if (typeof (reviews) !== "number" && reviews != 0) {
                return res.status(400).send({ status: false, msg: "Reviews will be in number format only and should be 0 while creating book" })
            }
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is mandatory" })
        }
        if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD format (only 19th and 20 centuries date is applicable." });
        releasedAt = moment(releasedAt).format('YYYY-MM-DD')
        data['releasedAt'] = releasedAt

        if (isDeleted) {
            data.isDeleted = false
        }

        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, msg: "success", data: savedData })

    }
    catch (err) {
        return res.status(500).send({ status: false, mag: err.message })
    }
}


//<----------------------Get Books API --------------------->
const books = async function (req, res) {
    try {
        let queries = req.query
        console.log(queries);

        if (Object.keys(queries).length == 0) {
            let bookList = await bookModel.find({ isDeleted: false }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0 }).sort("title")

            if (bookList.length == 0) return res.status(404).send({ status: false, msg: "No data found" })

            return res.status(200).send({ status: true, msg: "list of Books", data: bookList })
        }

        const { userId, category, subcategory } = req.query
        const filter = { isDeleted: false }

        if (userId) {
            if (userId == undefined || userId.trim() == "") {
                return res.status(404).send({ status: false, msg: "please give value of filter" })
            }

            if (!ObjectId(userId.trim())) { return res.status(400).send({ status: false, msg: "Invalid UserId" }) }
            filter.userId = userId.trim()
        }

        if (category) {
            if (category == undefined || category.trim() == "") {
                return res.status(404).send({ status: false, msg: "please give value of filter category" })
            }
            filter.category = category.trim()
        }
        if (subcategory) {
            if (subcategory == undefined || subcategory.trim() == "") {
                return res.status(404).send({ status: false, msg: "please give value of filter Subcategory" })
            }
            filter.subcategory = subcategory.trim()
        }

        console.log(filter);

        let bookList = await bookModel.find(filter).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, __v: 0 }).sort("title")

        if (bookList.length == 0) return res.status(404).send({ status: false, msg: "No data found" })


        return res.status(200).send({ status: true, msg: "list of Books", data: bookList })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}


//<=======================Get Book by bookId API=================================>

const getParticularBook = async function (req, res) {

    let bookId = req.params.bookId
    if (!ObjectId(bookId)) return res.status(400).send({ status: false, message: " Invalid bookId" })

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0, ISBN: 0, deletedAt: 0 })

    if (!book) return res.status(404).send({ status: false, message: "bookId is not found" })

    let obj = book._doc
    reviewsData = await reviewModel.find({ bookId: bookId })
    obj["reviewsData"] = reviewsData
    res.status(200).send({ status: true, message: "Book list", data: obj })


}


//<=======================Update Book by bookId API=================================>
const updateBookById = async function (req, res) {
    try {

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