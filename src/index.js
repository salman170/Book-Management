const express = require('express');
const bodyParser = require('body-parser');
 const route = require('./routes/route.js');
const app = express();
const mongoose = require ('mongoose')
require("dotenv").config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


 app.use('/', route);

app.listen(process.env.PORT, function () {
    console.log('Express app running on port ' + process.env.PORT )
});



app.use(function (req, res) {
    return res.status(404).send({status : false, msg : "path not found"})
    });