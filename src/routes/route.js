const express = require("express")
const router = express.Router();
const { createUser, userLogin } = require('../controllers/userController')
const { validUserMW } = require("../middlewares/validUserMW")



router.post("/register", validUserMW, createUser)
router.post('/login', userLogin)

// router.get('/test-me')


module.exports = router