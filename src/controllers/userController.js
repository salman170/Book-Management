const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken')
const { validEmail } = require("../validation/validUser.js")


//<----------------------Create User API --------------------->
const createUser = async function (req, res) {
	try {
		const body = req.body
		const { title, name, phone, email, password, address } = req.body


		//  ------- checking uniqueness of phone no. -------
		let phone_in_DB = await userModel.findOne({ phone: phone })
		if (phone_in_DB) return res.status(409).send({ status: false, msg: "Phone no. is already registered" })


		//  ---------checking uniqueness of email ---------
		let email_in_DB = await userModel.findOne({ email: email })
		if (email_in_DB) return res.status(409).send({ status: false, msg: "Email is already registered" })


		//  -------------- creating new user --------------
		const newUser = await userModel.create(body)
		return res.status(201).send({ status: true, msg: "User successfully Registerd", data: newUser })
	}
	catch (err) {
		return res.status(500).send({ status: false, msg: err.message })
	}


}




//<---------------------- User Login API --------------------->
//Salman 

const userLogin = async function (req, res) {
	try {
		const body = req.body
		if (Object.keys(body).length == 0) return res.status(400).send({ status: false, msg: "Please fill data in body" })

		const { email, password } = req.body

		if (!email) return res.status(400).send({ status: false, msg: "Email is mandatory" })
		if (!validEmail(email)) return res.status(400).send({ status: false, msg: "Invalid email, ex.- ( abc123@gmail.com )" })



		if (!password) return res.status(400).send({ status: false, msg: "Password is mandatory" })

		let userInDb = await userModel.findOne({ email: email, password: password });
		if (!userInDb) return res.status(401).send({ status: false, msg: "email or the password is not corerct" })

		let token = jwt.sign(
			{
				userId: userInDb._id.toString(),
				exp: Math.floor(Date.now() / 1000) + (50 * 60), // After 50 min it will expire 
				iat: Math.floor(Date.now() / 1000)
			}, "FunctionUp Group No 57");

		const date = new Date();
		console.log(`Token Generated at:- ${date.getHours()} :${date.getMinutes()} :${date.getSeconds()}`);
		res.setHeader("x-api-key", token);
		res.status(201).send({ status: true, token: token });

		// Printing the JWT token
		console.log(token);
	}
	catch (err) {
		console.log("This is the error :", err.message)
		res.status(500).send({ status: false, msg: "Error", error: err.message })
	}

}



module.exports = { createUser, userLogin }



