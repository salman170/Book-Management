const express = require("express")
const router = express.Router();
const { createUser, userLogin } = require('../controllers/userController')
const {createBook, books, getParticularBook} = require('../controllers/bookController')
const { validUserMW } = require("../middlewares/validUserMW")
const { authentication , authorization } = require("../middlewares/auth")




router.post("/register", validUserMW, createUser)

router.post('/login', userLogin)

router.post('/books',authentication,createBook)

router.get('/books',authentication, books)

router.get('/books/:bookId', authentication , getParticularBook)

router.get('/books/:bookId', authentication , getParticularBook)


module.exports = router