const express = require("express")
const router = express.Router();
const { createUser, userLogin } = require('../controllers/userController')
const { createBook, books, getParticularBook, updateBookById, deleteBookById } = require('../controllers/bookController')
const { validUserMW } = require("../middlewares/validUserMW")
const { createBookMW } = require("../middlewares/validBookMW")
const { authentication, authorization,authorization2 } = require("../middlewares/auth")
const { createReview, updateReview, deleteByBookId_ReviewId } = require('../controllers/reviewController')




//<--------------------User API's---------------------------->
router.post("/register", validUserMW, createUser)
router.post('/login', userLogin)

//<--------------------Book API's---------------------------->
router.post('/books',authentication, authorization2,createBookMW,createBook)
// router.post('/books', createBookMW, createBook)
router.get('/books', authentication, books)
router.get('/books/:bookId', authentication, getParticularBook)
router.put('/books/:bookId', authentication, authorization, updateBookById)
router.delete('/books/:bookId', authentication, authorization, deleteBookById)

//<--------------------Book API's---------------------------->
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete("/books/:bookId/review/:reviewId", deleteByBookId_ReviewId)

module.exports = router