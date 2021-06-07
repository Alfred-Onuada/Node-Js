var countries = {};

const API_KEY = "82770e1badc44aedb989b416a090fe15";

var sI;

function search() {

    const searchField = document.getElementById('search');
    const clear = document.getElementById("clearIcon");

    clear.addEventListener('click', ()=>{
        searchField.value = '';
    })

}

function searchLogic() {

    const searchField = document.getElementById('search');
    const countryList = document.getElementById('countryList');

    const icon = document.getElementById("sicon");

    icon.innerHTML = "";
    icon.classList.add("preloader");

    // just being lazy i first trim the sentence and then any white space inbetween letters are made #
    var search = (searchField.value.trim()).replace('\s', "#");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/search/${search}`, true);
    xhr.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            
            var data = this.responseText;

            if (data.match("empty")) {

                countryList.innerHTML = "<div class='errorwrapper'><h4 class='erromsg'>Not Found</h4></div>";

            } else {

                data = JSON.parse(data);

                var cards = "";
                for (let index = 0; index < data.length; index++) {
                    var content = data[index];

                    var cName = content.Name;
                    
                    var date = content.LocalTime.split("")[0];
                    var LocalTime = countries[cName];

                    cards += `

                        <div class="eachCountry">
                        
                            <div class="card">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img class="activator cImg" src="${content.Flag}">
                                </div>
                                <div class="card-content">
                                    <span class="hide" id="cName${index}">${content.Name}</span>
                                    <span class="country-title activator grey-text text-darken-4">${content.Name }<i class="material-icons right">more_vert</i></span>
                                    
                                    <span class="country-time activator grey-text text-darken-4 lT${index }" id="lT${index }">${LocalTime }</span>

                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">${content.Name } <i class="material-icons right">close</i></span>
                                    <p>Capital State: ${content.Capital } </p>
                                    <p id="lD${index }">UTC Date: ${date } </p>
                                    <p class="lT${index }">Local Time: ${LocalTime } </p>
                                    <p>UTC TimeOffset: ${content.TimeOffset } </p>
                                </div>
                            </div>      
                        
                        </div>

                    `;

                };

                cards += `
                    <div class="addBtn">
                        <a href="/add">
                            <div class="addCircle">
                                <span class="material-icons-round addIcon">add</span>
                            </div>
                        </a>
                    </div>
                `;

                countryList.innerHTML = cards;

            }

            icon.innerHTML = "search";
            icon.classList.remove("preloader");

        }
    }
    xhr.send();

}

function display(x, result) {
    
    var Name = x;

    var img = document.getElementById('iHimg');
    var text = document.getElementById('cName');

    // form fields
    var capital = document.getElementById('cCapital');
    var API = document.getElementById('cReqAddress');
    var localTime = document.getElementById('cLocalTime');
    var timeOffset = document.getElementById('cTimeOffset');
    var flag = document.getElementById('cFlag');

    // form fields labels
    var capitalLabel = document.getElementById('cCL');
    var APILabel = document.getElementById('cRAL');
    var localTimeLabel = document.getElementById('cLTL');
    var timeOffsetLabel = document.getElementById('cTOL');
    var btn = document.getElementById('cBtn');

    // disable the button
    btn.disabled = true;

    var spinners = document.getElementsByClassName('loader');

    img.src = result.flag;

    flag.value = result.flag;

    // remove preloader first
    capitalLabel.classList.add('active');
    capital.value = result.capital;

    APILabel.classList.add('active');
    API.value = result.region + ", " + result.name;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://timezone.abstractapi.com/v1/current_time/?api_key=${API_KEY}&location=${API.value}`, true);
    xhr.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {

            var response = JSON.parse(this.responseText);
            
            localTimeLabel.classList.add('active');
            localTime.value = response.datetime;

        }
    }
    xhr.send();

    timeOffsetLabel.classList.add('active');
    timeOffset.value = result.timezones[0] == "UTC" ? "UTC+00:00" : result.timezones[0];

    for (let index = 0; index < spinners.length; index++) {
        const element = spinners[index];
        element.classList.add('hide');
    }

    var t = new Date(Date.now());
    var offset = t.getTimezoneOffset();
    var lH = t.getHours() * 3600;
    var lM = t.getMinutes() * 60;
    var lS = t.getSeconds();

    var total = lH + lM + lS;

    var GMT = offset >= 0 ? total - (offset * 60) : total + (offset*60)

    var d = GMT/3600;
    GMT_H = d.toString().split('.')[0];

    var GMT_M = parseInt(d.toString().split('.')[1])

    // button is enabled only after api results has loaded
    btn.disabled = false;
    
}

function findCountry() {

    var img = document.getElementById('iHimg');
    var text = document.getElementById('cName');

    // form fields
    var capital = document.getElementById('cCapital');
    var API = document.getElementById('cReqAddress');
    var localTime = document.getElementById('cLocalTime');
    var timeOffset = document.getElementById('cTimeOffset');
    var flag = document.getElementById('cFlag');

    // form fields labels
    var capitalLabel = document.getElementById('cCL');
    var APILabel = document.getElementById('cRAL');
    var localTimeLabel = document.getElementById('cLTL');
    var timeOffsetLabel = document.getElementById('cTOL');
    var btn = document.getElementById("cBtn");

    // disable the button
    btn.disabled = true;

    var spinners = document.getElementsByClassName('loader');

    for (let index = 0; index < spinners.length; index++) {
        const element = spinners[index];
        element.classList.remove('hide');
    }

    var cName = text.value.trim() == '' ? '' : text.value.trim();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://restcountries.eu/rest/v2/name/'+cName, true);
    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4){

            // what is recieved is a string so am pasring it to json
            var res = JSON.parse(this.responseText);

            // to check if two or more countries matched the search
            if(res.length == 1) {
                
                img.src = res[0].flag;

                flag.value = res[0].flag;

                // remove preloader first
                capitalLabel.classList.add('active');
                capital.value = res[0].capital;

                APILabel.classList.add('active');
                API.value = res[0].region + ", " + res[0].name;

                var xhr = new XMLHttpRequest();
                xhr.open("GET", `https://timezone.abstractapi.com/v1/current_time/?api_key=${API_KEY}&location=${API.value}`, true);
                xhr.onreadystatechange = function () {
                    if (this.status == 200 && this.readyState == 4) {

                        var response = JSON.parse(this.responseText);

                        console.log(response);
                        
                        localTimeLabel.classList.add('active');
                        localTime.value = response.datetime;

                    }
                }
                xhr.send();

                timeOffsetLabel.classList.add('active');
                timeOffset.value = res[0].timezones[0] == "UTC" ? "UTC+00:00" : res[0].timezones[0];

                for (let index = 0; index < spinners.length; index++) {
                    const element = spinners[index];
                    element.classList.add('hide');
                }

                var t = new Date(Date.now());
                var offset = t.getTimezoneOffset();
                var lH = t.getHours() * 3600;
                var lM = t.getMinutes() * 60;
                var lS = t.getSeconds();

                var total = lH + lM + lS;

                var GMT = offset >= 0 ? total - (offset * 60) : total + (offset*60)

                var d = GMT/3600;
                GMT_H = d.toString().split('.')[0];

                var GMT_M = parseInt(d.toString().split('.')[1])

                btn.disabled = false;

                // var time = t.getHours().toString() + t.getMinutes().toString() + t.getSeconds().toString();

            } else if(res.length > 1) {

                dataList = {};

                for (let index = 0; index < res.length; index++) {
                    const content = res[index];
        
                    var countryName = content.name;
                    dataList[countryName] = null;
                };

                $(document).ready(function(){
 
                    $('input.autocomplete').autocomplete({
                 
                        data: dataList,
                        limit: 5,
                        // this callback recieves an argument of the selected Data
                        onAutocomplete: (x) => {

                            for (let index = 0; index < res.length; index++) {
                                const element = res[index];
                                
                                if (element.name == x){
                                    display(x, element);
                                    break;
                                }
                            }

                        },
                 
                    });
                 
                  });

            }

        
        }
    }
    xhr.send();

}

function form_submit(form) {
    
    form.onsubmit = function(e) {
        e.preventDefault();

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/add', true);
        xhr.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4){
                
                var response = this.responseText;

                // can do some stuffs later for now i am pushing to the new page directly

            }
        }
        xhr.send();

    }

}

var form = document.getElementById('countryFrom');
if (form != undefined && form != null) {
    form_submit(form);
}

function updateTime(index) {
    
    var t = document.getElementsByClassName("lT"+index);
    var d = document.getElementById("LD"+index);

    sI = setInterval(()=> {

        var LocalTime = document.getElementById("lT"+index);

        if (LocalTime != null && LocalTime != undefined) {

            var countryName = document.getElementById("cName"+index).textContent;

            var LocalTime = document.getElementById("lT"+index).textContent;

            var LocalTime = LocalTime.split(":");

            var hour = parseInt(LocalTime[0]);
            var min = parseInt(LocalTime[1]);
            var sec = parseInt(LocalTime[2]);

            sec += 1;
            if (sec >  59) {
                min += 1;
                sec = "00";

                if (min > 59) {
                    hour += 1;
                    min = "00";

                    if (hour > 23) {
                        //
                    }

                } 

            }
            
            if (sec < 10 && sec != 0 ) {
                sec = "0" + sec.toString();
            }
            if (min < 10) {
                min = "0" + min.toString();
            }
            if (hour < 10) {
                hour = "0" + hour.toString();
            }

            countries[countryName] = hour.toString() + ":" + min.toString() + ":" + sec.toString();

            for (let index = 0; index < t.length; index++) {
                const element = t[index];element.innerHTML = hour.toString() + ":" + min.toString() + ":" + sec.toString();
                element.innerHTML = hour.toString() + ":" + min.toString() + ":" + sec.toString();
            }

        } else {

            clearInterval(sI);

        }
    
    }, 1000);


}