const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const moment = require("moment")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId.isValid

//<=======================Delete Book by bookId API=================================>
const createReview = async function (req, res) {
    try {
        let bookIs = req.params.bookId
        console.log(bookIs)
        let data = req.body

        let bookInDb = await bookModel.findOne({ _id: bookIs, isDeleted: false })
        if (!bookInDb) return res.status(404).send({ status: false, message: "No data found" })

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please give data to create review" })
        }
        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = data

        if (!bookId) {
            return res.status(400).send({ status: false, message: "BookId is mandatory" })
        }
        if (!ObjectId(bookId)) { return res.status(400).send({ status: false, msg: "BookId is not in format" }) }

        let book = await bookModel.findById({ _id: bookId })

        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not exist" })
        }

        if (!reviewedBy.trim()) {
            return res.status(400).send({ status: false, message: "ReviewedBy is mandatory" })
        }
        if (!/^[a-zA-Z \s]+$/.test(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "ReviewedBy only on alphabets" })
        }
        if (!reviewedAt) {
            return res.status(400).send({ status: false, message: "ReviewedAt is mandatory" })
        }        
        if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(reviewedAt)) return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD format" });
        reviewedAt = moment(reviewedAt).format('YYYY-MM-DD')
        data['reviewedAt'] = reviewedAt

        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (!/^[1-5]$/.test(rating)) {
            return res.status(400).send({ status: false, msg: "Please provide a valid rating( rating should between 1-5 digit )" })
        }
        
        if (!/^[a-zA-Z \s]+$/.test(review)) {
            return res.status(400).send({ status: false, msg: "Review only on alphabets" })
        }

        if (isDeleted) {
            data.isDeleted = false
        }

        let reviewData = await reviewModel.create(data)
        let obj = reviewData._doc
        delete obj["createdAt"]
        delete obj["updatedAt"]
        delete obj["__v"]
        delete obj["_id"]
        delete obj["isDeleted"]

        let count = await bookModel.findOneAndUpdate({_id:bookIs},{$inc:{reviews:+1}})
        return res.status(201).send({ status: true, message: "success", data: obj })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//<=======================Delete Book by bookId API=================================>
const updateReview = async function (req,res){

}

//<=======================Delete Book by bookId API=================================>
const deleteByBookId_ReviewId = async function (req, res) {
    try {

        const { bookId, reviewId } = req.params

        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is mandatory" })
        }
        if (!ObjectId(bookId)) { return res.status(400).send({ status: false, msg: "bookId is not in format" }) }

        if (!reviewId) {
            return res.status(400).send({ status: false, msg: "reviewId is mandatory" })
        }
        if (!ObjectId(reviewId)) { return res.status(400).send({ status: false, msg: "reviewId is not in format" }) }


        const book_in_DB = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book_in_DB) return res.status(404).send({ status: false, msg: "No book found" })


        const review_in_DB = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review_in_DB) return res.status(404).send({ status: false, msg: "No review found" })


        if (book_in_DB.reviews == 0) return res.status(404).send({ status: false, msg: "already 0" })

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { "reviews": -1 } }, { new: true })
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true })

        // console.log(updatedBook);
        // console.log(updatedReview);

        return res.status(200).send({ status: true, msg: "successfully deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createReview ,updateReview,deleteByBookId_ReviewId}