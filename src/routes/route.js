const express = require("express")
const router = express.Router();
const {createUser ,userLogin} = require('../controllers/userController')



router.post("/register", createUser)
router.post('/login', userLogin)

// router.get('/test-me')


  module.exports=router