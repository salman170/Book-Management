const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const { validEmail } = require("../validation/validUser.js")


//<----------------------Create User API --------------------->
const createUser = async function (req, res) {
	try {
		const body = req.body
		const { phone, email } = req.body


		//  ------- checking uniqueness of phone no. -------
		let phone_in_DB = await userModel.findOne({ phone: phone })
		if (phone_in_DB) return res.status(409).send({ status: false, message: "Phone no. is already registered" })


		//  ---------checking uniqueness of email ---------
		let email_in_DB = await userModel.findOne({ email: email })
		if (email_in_DB) return res.status(409).send({ status: false, message: "Email is already registered" })


		//  -------------- creating new user --------------
		const newUser = await userModel.create(body)
		return res.status(201).send({ status: true, message: "User successfully Registerd", data: newUser })
	}
	catch (err) {
		return res.status(500).send({ status: false, message: err.message })
	}


}




//<---------------------- User Login API --------------------->
//Salman 

const userLogin = async function (req, res) {
	try {
		const body = req.body
		if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "Please fill data in body" })

		const { email, password, ...rest } = req.body

		if (Object.keys(rest).length>0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data ` })

		if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
		if (!validEmail(email)) return res.status(400).send({ status: false, message: "Invalid email, ex.- ( abc123@gmail.com )" })

		if (!password) return res.status(400).send({ status: false, message: "Password is mandatory" })

		let userInDb = await userModel.findOne({ email: email, password: password, isDeleted: false });
		if (!userInDb) return res.status(401).send({ status: false, message: "invalid credentials (email or the password is not corerct)" })

		let token = jwt.sign(
			{
				userId: userInDb._id.toString(),
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 ), // After 24 hours it will expire //Date.now() / 1000 => second *60
				iat: Math.floor(Date.now() / 1000)
			}, "FunctionUp Group No 57");

		res.setHeader("x-api-key", token);

		let data = {
			token: token,
			userId: userInDb._id.toString(),
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // After 24 hours it will expire 
			iat: Math.floor(Date.now() / 1000)

		}
		res.status(201).send({ status: true, message: "Token has been successfully generated.", data: data });
	}
	catch (err) {
		console.log("This is the error :", err.message)
		res.status(500).send({ status: false, message: "Error", error: err.message })
	}

}



module.exports = { createUser, userLogin }



