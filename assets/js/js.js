
//var moment = require('moment');

var apiKey = 'e25813769e73c32b981b464f3ca85e2c';

console.log("loading js script file ...");
var searchButton = document.getElementById("submit-button");
var searchInput = document.getElementById("search-input");

//populate 
var previousSearchArray = JSON.parse(localStorage.getItem("city"));

if (previousSearchArray === null) {
    previousSearchArray = []; //asign empty array 
}
console.log(previousSearchArray);

//var now = moment().format("MMM Do YY");           


//Declaring a Function 
function getWeather(event) {
    event.preventDefault();
    //grab the city name 
    console.log("Search Input", searchInput.value);

    var locationURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + '&limit=1&appid=' + apiKey;
    console.log(locationURL);


    //Fetching the lat and Lon based on the search input entered by the user 
    fetch(locationURL)

        .then(function (res) {
            //console.log("Response", res);
            return res.json(); //returns a JSON friendly response on a successful api call
        }).then(function (apiData) {
            console.log("Api JSON Response", apiData);

            //GRAB THE LAT AND LON from the response 
            var latitude = apiData[0].lat;
            var longitude = apiData[0].lon;

            console.log("lat", longitude, latitude);
            //display the city on the HTML 
            let currentCity = document.getElementById("current-city")
            currentCity.textContent = apiData[0].name;

            // CALL THE ONE CALL API fetch request 
            oneCallAPIWeather(latitude, longitude);
            //console.log (oneCallAPIWeather(latitude, longitude))
            //cityStorage
            //append my new city to the previously searched City list from local storage 
            previousSearchArray.unshift(currentCity.textContent);

            //Set the city in lOcal Storage 
            localStorage.setItem("city", JSON.stringify(previousSearchArray));

            //refreshes your search city list 
            cityStorage();

        }).catch(function (error) {
            console.log("Error Msg", error)
        })




    //Reset the search input field 
    searchInput.value = "";
}

function oneCallAPIWeather(latitude, longitude) {

    //URL variable 
    var oneCallAPIWeather = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=alerts&appid=' + apiKey
    console.log(oneCallAPIWeather)

    //FETCH REQUEST 
    fetch(oneCallAPIWeather)
        .then(function (response) {

            return response.json();
        }).then(function (apiData) {
            console.log("api data", apiData);


            console.log(apiData.current.temp)

            JSON.stringify(apiData)


            document.getElementById("current-temp").innerHTML =  "<br/>" + "Temperature: " + apiData.current.temp + "℉" + "<br/>" + "Wind: " + apiData.current.wind_speed + "<br/>" + "Humidity: " + apiData.current.humidity + "</br>" + "UV Index: " + apiData.current.uvi

            for (let i = 0; i < 5; i++) {
                let futureTemp = JSON.stringify(apiData.daily[i].temp.day, 10)
                let wind = apiData.daily[i].wind_speed
                let uvi = apiData.daily[i].uvi
                let humidity = apiData.daily[i].humidity
                console.log(futureTemp)

                //document.getElementById("future-forecast").innerHTML = "Temperature:" + futureTemp  + "Wind: " + apiData.daily[i].wind_speed + "<br />" + "UVI: " + apiData.daily[i].uvi + "<br />" + "Humidity: " + apiData.daily[i].humidity

                //apend to future-forcasr div

                const node = document.createElement("li");
                node.classList.add("future")
                const textnode = document.createTextNode("Temperature:" + futureTemp + "℉");
                const textnode2 = document.createElement("li");
                textnode2.textContent = "Wind: " + wind + "MPH";
                const textnode3 = document.createElement("li");
                textnode3.textContent = "UVI: " + uvi;
                const textnode4 = document.createElement("li");
                textnode4.textContent = "Humidity: " + humidity + "%";

                node.appendChild(textnode);
                node.appendChild(textnode2);
                node.appendChild(textnode3);
                node.appendChild(textnode4);
                document.getElementById("future-forecast").appendChild(node);

            }
            //document.getElementById("future-forecast")

        }).catch(function (error) {
            console.log("Error Msg", error)
        });


    //DISPLAY IT ON THE HTML PAGE 


}
function searchWeather(cityName) {

    var locationURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    console.log(locationURL);

    //Fetching the lat and Lon based on the search input entered by the user 
    fetch(locationURL)

        .then(function (res) {
            //console.log("Response", res);
            return res.json(); //returns a JSON friendly response on a successful api call
        }).then(function (apiData) {
            console.log("Api JSON Response", apiData);

            //GRAB THE LAT AND LON from the response 
            var latitude = apiData[0].lat;
            var longitude = apiData[0].lon;

            console.log("lat", longitude, latitude);
            //display the city on the HTML 
            let currentCity = document.getElementById("current-city")
            currentCity.textContent = apiData[0].name;

            // CALL THE ONE CALL API fetch request 
            oneCallAPIWeather(latitude, longitude);

        }).catch(function (error) {
            console.log("Error Msg", error)
        })


}

// ADD LOCALSTORAGE AND DISPLAY ON PAGE

function cityStorage() {
    console.log("city storage function ");
    //reset the old data 
    document.getElementById("search-history").innerHTML = "";

    //lop through all the cities searched earlier 
    let maxCount;
    if (previousSearchArray.length > 5) {
        maxCount = 5;
    } else {
        maxCount = previousSearchArray.length;
    }
    for (let i = 0; i < maxCount; i++) {
        const element = previousSearchArray[i];
        console.log("Previous saved cities ", element, " for ", i);

        //create a button 
        var historyButton = document.createElement('button')
        historyButton.classList.add("history-button")

        //display text 
        historyButton.textContent = element;

        //add event listener to call the searchweather 
        historyButton.addEventListener('click', function () {
            searchWeather(element);
        })

        //append to search-history div
        document.getElementById("search-history").appendChild(historyButton);

    }

}

cityStorage();

//Add Event listener 
searchButton.onclick = getWeather;

//One Call API EXAMPLE 
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//Get Lat and Lon API Call 
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}