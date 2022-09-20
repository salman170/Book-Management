const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')


//<----------------------Create User API --------------------->
//Tarun, Matheen 
const createUser = async function (req, res) {
    try {
        const Body = req.body
        const { title, name, phone, email, password, address } = req.body


        //  ---------checking uniqueness of email ---------
        let email_in_DB = await userModel.findOne({ email: email })
        if (email_in_DB) return res.status(409).send({ status: false, msg: "Email is already registered" })


        //  ------- checking uniqueness of phone no. -------
        let phone_in_DB = await userModel.findOne({ phone: phone })
        if (phone_in_DB) return res.status(409).send({ status: false, msg: "Phone no. is already registered" })


        //  -------------- creating new user --------------
        const newUser = await userModel.create(Body)
        return res.status(201).send({ status: true, msg: "User successfully Registerd", data: newUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}





























//<---------------------- User Login API --------------------->
//Awneesh 
const userLogin = async function () {


}












module.exports = { createUser, userLogin }



