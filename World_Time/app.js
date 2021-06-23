const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

// Initializing server with http
const http = require('http');
const server = http.createServer(app);

// Using socket Io for web sockets
const { Server } = require("socket.io");
const io = new Server(server);

// this module allows you to make use of enviroment variables
require('dotenv').config({path: __dirname + '/.env'}); // notice you dont need to store it in a variable and you need to specify the path to it

module.exports = io;

const uri = "mongodb+srv://adminUser:adminPassword@todo-db.az8gh.mongodb.net/World_Time?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    // this request above is an asynchronous code using the then am waiting for when it finishes before I start the app
    .then((result) => {

        const port = process.env.PORT || 3000; 
        console.log("Starting app...");

        server.listen(port);
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