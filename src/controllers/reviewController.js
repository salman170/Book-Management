const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')
const moment = require("moment")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId.isValid

//<=======================Create Book reviewby bookId API=================================>
const createReview = async function (req, res) {
    try {
        let bookIdInParam = req.params.bookId

        if (!ObjectId(bookIdInParam)) { return res.status(400).send({ status: false, msg: "bookId in Param is not in format" }) }

        let data = req.body

        let bookInDb = await bookModel.findOne({ _id: bookIdInParam, isDeleted: false })
        if (!bookInDb) return res.status(404).send({ status: false, message: `No data found for bookId (${bookIdInParam})` })

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please give data to create review" })
        }

        let { reviewedBy, rating, review, isDeleted, reviewedAt, bookId, ...rest } = data

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, msg: `You can not fill these:-( ${Object.keys(rest)} ) data ` })


        data["bookId"] = bookIdInParam

        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (!/^[1-5]$/.test(rating)) return res.status(400).send({ status: false, msg: "Please provide a valid rating( rating should between 1-5 digit )" })

        let date = Date.now()
        reviewedAt = moment(date).format('YYYY-MM-DD')
        data['reviewedAt'] = reviewedAt

        if (typeof reviewedBy == "string" && reviewedBy.trim() == "") {
            data.reviewedBy = "Guest"
            reviewedBy = "Guest"
        }

        if (!reviewedBy) return res.status(400).send({ status: false, message: "reviewedBy (reviewer's name) is mandatory" })

        if (!/^[a-zA-Z \s]+$/.test(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "reviewedBy only on alphabets" })
        }

        if (review && typeof review != "string") {
            return res.status(400).send({ status: false, msg: "Review will only string" })
        }

        if (isDeleted) {
            data.isDeleted = false
        }

        let reviewsData = await reviewModel.create(data)

        let bookReviwes = await bookModel.findOneAndUpdate({ _id: bookIdInParam }, { $inc: { reviews: +1 } }, { new: true }).select({ updatedAt: 0, __v: 0, isDeleted: 0 })

        let result = bookReviwes.toObject()
        result.reviewsData = reviewsData

        return res.status(201).send({ status: true, msg: "Reviewes Added Succesfully", data: result })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//<=======================Update Book Review by bookId &API=================================>
const updateReview = async function (req, res) {
    try {
        let bookIs = req.params.bookId;
        let reviewId = req.params.reviewId;
        let data = req.body;


        if (!ObjectId(bookIs)) return res.status(400).send({ status: false, msg: "Invalid BookId" })

        if (!ObjectId(reviewId)) return res.status(400).send({ status: false, msg: "Invalid reviewId" })

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "please enter require data to update review" })

        let book = await bookModel.findOne({ _id: bookIs, isDeleted: false });

        if (!book) return res.status(404).send({ status: false, message: "Book not found" });

        let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false });

        if (!checkReview) return res.status(404).send({ status: false, message: "Review not found" });

        if (checkReview.bookId != bookIs) return res.status(400).send({ status: false, msg: "BookId in param isn't matching with reviews docment's bookId " })

        const { review, rating, reviewedBy, ...rest } = data

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, msg: `You can not update these:-( ${Object.keys(rest)} ) data` })

        if (review && typeof review != "string") return res.status(400).send({ status: false, msg: "Review format is wrong, it will be string only" })

        if (rating && !/^[1-5]$/.test(rating)) return res.status(400).send({ status: false, msg: "Please provide a valid rating( rating should between 1-5 digit )" })

        if (reviewedBy && !/^[a-zA-Z \s]+$/.test(reviewedBy)) return res.status(400).send({ status: false, msg: "ReviewedBy only on alphabets" })

        let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: data }, { new: true });

        let result = book.toObject();
        result.reviewsData = updateReview;
        res.status(200).send({ status: true, message: "Review Update Successfully", date: result });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//<=======================Delete review by bookId API=================================>
const deleteByBookId_ReviewId = async function (req, res) {
    try {

        const { bookId, reviewId } = req.params

        if (!ObjectId(bookId)) { return res.status(400).send({ status: false, msg: "bookId in param is not in format" }) }

        if (!ObjectId(reviewId)) { return res.status(400).send({ status: false, msg: "reviewId is not in format" }) }


        const book_in_DB = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book_in_DB) return res.status(404).send({ status: false, msg: "No book found" })


        const review_in_DB = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review_in_DB) return res.status(404).send({ status: false, msg: "No review found" })

        if (review_in_DB.bookId != bookId) return res.status(400).send({ status: false, msg: "BookId in param isn't matching with reviews docment's bookId so can't delete review" })

        if (book_in_DB.reviews == 0) return res.status(404).send({ status: false, msg: "review is already 0" })

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, { $inc: { "reviews": -1 } }, { new: true })
        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true })

        console.log(updatedBook);
        console.log(updatedReview);

        return res.status(200).send({ status: true, msg: "review is successfully deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createReview, updateReview, deleteByBookId_ReviewId }