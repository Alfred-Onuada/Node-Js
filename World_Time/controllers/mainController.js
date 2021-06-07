// this is used to just like ajax, the default is just so i can have autocomplete
const axios = require('axios').default;

// API Key
const API_KEY = "82770e1badc44aedb989b416a090fe15";

// import the db
const Country = require("./../models/countryModel"); // the model is in an object on the module.exports called country

module.exports = function(app) {

    // this conflicts with other apps that are on port 3000 but these apps are not going to be running simultaneously.
    app.get('/', (req, res) => {

        console.log(`request made to: ${req.url}`);

        Country.find()
            .then((countryData) => {

                if (countryData.length == 0) {

                    res.render("selectCountry", {'countryData': countryData});

                }

                return countryData;
 
            })
            // this countrydata is what is returned from above
            .then((countryData) => {

                async function getData() {

                    for (let index = 0; index < countryData.length; index++) {
                        const content = countryData[index];

                        // this makes sure the loop pauses during each iteration as i only get 1 req per second on the api
                        await axios.get(`https://timezone.abstractapi.com/v1/current_time/?api_key=${API_KEY}&location=${content.ReqAddress}`)
                            .then(function (response) {
                                // the response contains two properties the heaer and the data
                                content.LocalTime = response.data.datetime;
                    
                                // this makes sure it only render when this loop is done because this code is an async code.
                                if (index == (countryData.length - 1)) {
                    
                                    res.render("selectCountry", {'countryData': countryData});
                    
                                }
                                
                                return content._id;
                            })
                            .then((id) => {
                                Country.findByIdAndUpdate(id, { LocalTime: content.LocalTime })
                                    .then((docs) => {
                                        // 
                                    })
                                    .catch((err) => {
                                        if (err) throw err;
                                    })
                            })
                            .catch((err) => {
                                if (err) throw err;
                            })
    
                    }

                }

                getData();
                
            })
            .catch((err) => {
                if (err) throw err;
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
