const express = require("express")
const router = express.Router();
const { createUser, userLogin } = require('../controllers/userController')
const {createBook, books, getParticularBook,updateBookById, deleteBookById} = require('../controllers/bookController')
const { validUserMW } = require("../middlewares/validUserMW")
const { authentication , authorization } = require("../middlewares/auth")



//<--------------------User API's---------------------------->
router.post("/register", validUserMW, createUser)
router.post('/login', userLogin)

//<--------------------Book API's---------------------------->
router.post('/books',authentication, authorization,createBook)
router.get('/books',authentication, books)
router.get('/books/:bookId', authentication , getParticularBook)
router.put('/books/:bookId', authentication ,authorization, updateBookById)
router.delete('/books/:bookId', authentication ,authorization, deleteBookById)



module.exports = router