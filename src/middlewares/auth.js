const jwt = require('jsonwebtoken');
const bookModel = require('../model/bookModel')
const ObjectId = mongoose.Types.ObjectId.isValid


//<=======================Authentication =================================>
const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        //If no token is present in the request header return error. This means the user is not logged in.
        if (!token) {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
        jwt.verify(token, "FunctionUp Group No 57", (err, decodedToken) => {
            if (err) {
                return res.status(401).send({ status: false, message: "token is not valid" })
            }
            req.userId = decodedToken.userId
            //Set an attribute in request object 
            next();
        })

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};


//<=======================Authorization =================================>
const authorization = async function (req, res, next) {
    try {
        if (!req.params.bookId)
            return res.status(403).send({ Status: false, msg: "You are not authorized provide bookId in path param " })

        let bookId = req.params.bookId

        if (!ObjectId(bookId)) { return res.status(400).send({ status: false, msg: `${bookId}is not in MongoDb objectId format` }) }

        let bookdetails = await bookModel.findById(bookId)
        if (!bookdetails) {
            return res.status(400).send({ status: false, msg: "bookId is invalid" })
        }

        if (bookdetails.userId._id.toString() !== req.userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized" })
        }

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { authentication, authorization }