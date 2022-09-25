const { validTitle, validName, validPhone, validEmail, validPassword, validStreet, validPincode } = require("../validation/validUser.js")

//  middleware for validation of registering user
const validUserMW = function (req, res, next) {
    try {
        const body = req.body
        const { title, name, phone, email, password, address, ...rest } = req.body

        if (Object.keys(rest).length>0) return res.status(400).send({ status: false, msg: `You can not fill these:-( ${Object.keys(rest)} ) data ` })

        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, msg: "Please fill data in body" })



        if (!title) return res.status(400).send({ status: false, msg: "Title is mandatory" })
        if (!validTitle(title)) return res.status(400).send({ status: false, msg: 'Invalid Title ,available tiltes ( Mr, Mrs, Miss)' })



        if (!name) return res.status(400).send({ status: false, msg: "Name is mandatory" })
        if (!validName(name)) return res.status(400).send({ status: false, msg: "Invalid name, available characters are ( a-z A-z .) with min 2 and max 30 charcters" })



        if (!phone) return res.status(400).send({ status: false, msg: "Phone no. is mandatory" })
        if (!validPhone(phone)) return res.status(400).send({ status: false, msg: "Invalid phone no. must be indian no. containing 10 digits." })



        if (!email) return res.status(400).send({ status: false, msg: "Email is mandatory" })
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: "Invalid email, ex.- ( abc123@gmail.com )" })



        if (!password) return res.status(400).send({ status: false, msg: "Password is mandatory" })
        if (!validPassword(password)) return res.status(400).send({ status: false, msg: "Use strong password, atleast one Uppercase characters & must contain ( a-z A-Z 0-9 [!@#\$%\^&\*] ) with min 8 and max 15 charcters" })



        // if (address == undefined || Object.keys(address).length == 0) return res.status(400).send({ status: false, msg: "address is mandatory" })
       if(address || address == ""){
        if (typeof address != "object" || Array.isArray(address)) return res.status(400).send({ status: false, msg: "address value will be an object" })
        if (address) {
            if (Object.keys(address).length == 0) {
                return res.status(400).send({ status: false, msg: "address details are empty (give street or city or pincode of user inside address object)" })
            }

            const { street, city, pincode } = address

            if (street || street == "") {
                if (!validStreet(street)) return res.status(400).send({ status: false, msg: "Invalid street name, available characters ( a-z A-Z 0-9 .,- )" })
            }
            if (city || city == "") {
                if (!validName(city)) return res.status(400).send({ status: false, msg: "Invalid city name, available characters ( a-z A-Z .)" })
            }
            if (pincode || pincode == "") {
                if (!validPincode(pincode)) return res.status(400).send({ status: false, msg: "Invalid pincode, available characters ( 0-9 ) with 6 digits " })
            }
        }
    }
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.validUserMW = validUserMW