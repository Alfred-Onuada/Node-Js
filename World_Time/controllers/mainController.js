// this is used to just like ajax, the default is just so i can have autocomplete
const axios = require('axios').default;

// API Key
const API_KEY = process.env['API_KEY'];

// import the db
const Country = require("./../models/countryModel"); // the model is in an object on the module.exports called country

module.exports = function(app) {

    // this helps me access io in this file
    io = require('./../app');

    // this conflicts with other apps that are on port 3000 but these apps are not going to be running simultaneously.
    app.get('/', (req, res) => {

        console.log(`request made to: ${req.url}`);

        // am juust send the page but the real data will load behind the scene
        res.render("selectCountry");

        io.on("connection" , function (clientSocket) {

            Country.find()
                .then((countryData) => {

                    clientSocket.emit("length", countryData.length);

                    // so the client is not listening in vain i send an empty array if there is no data
                    if (countryData.length == 0) {  
                        clientSocket.emit("data", null);
                    }

                    return countryData;
    
                })
                // this countrydata is what is returned from above
                .then((countryData) => {

                    function next(i, start, end) {
                        i++;
                        // this timer makes sure you dont make too many calls to the api per second

                        var time = (end - start) / 1000;

                        if (time < 1.2) {
                            time = 1200;
                        }

                        setTimeout(() => {
                            getData(i);
                        }, time);
                    }

                    function getData(index) {

                        if (index < 0) {
                            return;
                        }

                        if (index < countryData.length) {

                            var content = countryData[index];

                            // start time
                            var start = Date.now();
                            axios.get(`https://timezone.abstractapi.com/v1/current_time/?api_key=${API_KEY}&location=${content.ReqAddress}`)
                                .then(function (response) {

                                    var end = Date.now();

                                    // the response contains two properties the heaer and the data
                                    content.LocalTime = response.data.datetime;
                        
                                    // this makes sure it only render when this loop is done because this code is an async code.
                                    if (index == (countryData.length - 1)) {
                        
                                        clientSocket.emit("data", countryData);
                        
                                    }
                                    
                                    return [content._id, end];
                                })
                                .then((res) => {

                                    // define the variables from what was returned
                                    id = res[0];
                                    end = res[1];

                                    Country.findByIdAndUpdate(id, { LocalTime: content.LocalTime })
                                        .then((docs) => {
                                            // call recursive function
                                            next(index, start, end);
                                        })
                                        .catch((err) => {
                                            if (err) throw err;

                                            // call recursive function
                                            next(index, start, end);
                                        })
                                })
                                .catch((err) => {

                                    end = Date.now();
                                    if (err) throw err;

                                    // call recursive function
                                    next(index, start, end);
                                })
        
                        } else {
                            return;
                        }

                    }

                    // counter for recursion loop
                    index = 0;
                    getData(index);


                    
                })
                .catch((err) => {
                    if (err) throw err;
                });
                
            });
            
    });

    app.get('/home', (res, req) => {

        console.log(`request made to: ${req.url}`);

        res.redirect('/');
    });

    app.get('/search/:name?', (req, res) => {

        var name = req.params.name;
        Country.find()
            .then((response) => {

                // the name parameter is optional so this checks if its set
                if (!name) {
                    res.send(response);
                } else {
                    
                    name = name.replace("#", " ");

                    // make a list of all matches
                    var dataList = []

                    // this is like a search logic
                    response.forEach((content, index) => {
                        if (content.Name.match(name)) {
                            dataList.push(content);
                        }
                    })

                    if (dataList.length == 0) {
                        res.send("empty")
                    }

                    res.send(dataList);
                }
                
            })
            .catch((err) => {
                if (err) throw err;
            })

    })

    app.get('/delete', (req, res) => {

        console.log(`request made to: ${req.url}`);

        Country.deleteMany({})
            .then((result) => {
                res.send("Done");
            })
            .catch((err) => {
                if (err) throw err;
            });

    });

    app.get('/add', (req, res)=>{

        console.log(`request made to: ${req.url}`);

        res.render('addCountry');

    })

    app.post('/add', (req, res) => {
        
        Country.find({ "Name": req.body.Name })
            .then((docs) => {
                // check is country already exists
                if (docs.length == 0) {
                    
                    var data = Country(req.body).save((err, data) => {
                        if (err) throw err;
                        // am not using the data
                        res.redirect('/');
                    })

                } else {
                    // I'm not popping up an error message just sending you back
                    res.redirect("/");
                }
            })
            .catch((err) => {
                if (err) throw err;
            })

    })

};
