const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const uri = "mongodb+srv://adminUser:adminPassword@todo-db.az8gh.mongodb.net/World_Time?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    // this request above is an asynchronous code using the then am waiting for when it finishes before I start the app
    .then((result) => {

        const port = process.env.port || 3000; 
        console.log("Starting app...");
        app.listen(port);
        console.log(`App is now active on port ${port}`);

        console.log("Database Connection Succesful.");

    })
    .catch((err) => {
        console.log(err);
    })

// set a template engine
app.set('view engine', 'ejs');

// set a middle ware for handling post request so i dont have to always define it
app.use(bodyParser.urlencoded({ extended: false }));


// set static files path
app.use(express.static('./assets'));

var appController = require('./controllers/mainController');
appController(app);