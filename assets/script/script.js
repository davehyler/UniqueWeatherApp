//detect user location when opening page to show current weather in their area (if they so wish by "allowing" within the browser)
const x = document.getElementById("demo");
//upon pressing "submit" button user is met with two events running in background, location and current weather
document.getElementById("searchButton").addEventListener("click", locationHistory);
document.getElementById("searchButton").addEventListener('click', getWeatherInfo);

//provide if statement in order to inform users that their browser cannot (or currently does not) support geolocation
function userCity() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("We are unable to get your current location. Please manually type your city on the left to load weather info");
  }
}
function showPosition(position) {
let userLat = position.coords.latitude;
let userLong = position.coords.longitude;
  getWeatherInfo()
}

//if statement to check user entry. IF the history list matches the user entered string, it will not append, ELSE the city will be added to the list
function locationHistory(){
    selectedLocation = document.getElementById("userString").value;  
    historyList = weatherInfo();
    let weatherLocation =$("<div>") 
    weatherLocation.text(selectedLocation) 
    //TD: check to see if history includes city before appending
    if (historyList.includes(selectedLocation) == false) {$(".history").append(weatherLocation) }
    appendLocation(selectedLocation);
}; 

function getWeatherInfo(){   
    $(".weather-cards").empty();
    $(".city").empty()

   selectedLocation = document.getElementById("userString").value;   
    let countryCode='US';    
    let cityCode=selectedLocation;       
    
    let geoLon;   
    let geoLat;
        
    //declare content as HTML tags and APPEND to delcaration in order to dynamically generate (IE, declare temp/wind as a DIV to invoke a second line) //update, add line break?
    let cityName =$("<h4>")   
    $(".city").append(cityName)  
    let temp = $("<div>")  
    $(".city").append(temp)  
    let wind = $("<div>")  
    $(".city").append(wind)  
    let humidity = $("<div>")   
    $(".city").append(humidity)    
    let uvIndex = $("<div>")     
    $(".city").append(uvIndex)
    let dateTime = $("<div>")
    $(".city").append(dateTime)   
    let uvi =$("<div>")   
    //TODO: Remove DEBUG MESSAGE once function is working and passes along correct POST data.
    alert("Debug Message 1: function is working and location should be passed to API."); 
    //TODO use openweathermap API to find latitude and longitude values from user entered city and then fetch to receive results from API
    userLL = document.getElementById("apiKey").value;  
    let findLatLong = 'https://api.openweathermap.org/geo/1.0/direct?q='+cityCode+","+countryCode+"&appid="+userLL
    fetch(findLatLong)
    //use JSON to return the code needed (langitude and longitude) from entered city
    .then(function (response) {return response.json();})
    .then(function (data) {
    //declare values from fetched data into new variables
    geoLon = data[0].lon;
    geoLat = data[0].lat;
    //update initial lat and long that were detected on page load
    userLat = geoLon
    userLong = geoLat
    //use geoLat and geoLon to fetch the current weather by plugging those new variables into the API call
    //Remove sample API Key and replace with user variable: bd5e378503939ddaee76f12ad7a97608
    userAPI = document.getElementById("apiKey").value;  
    let callAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + geoLat + "&lon="+ geoLon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + userAPI;
    fetch(callAPI)
    //reminder: use THEN to continue action after retrieving a successful response via the fetch request
    .then(function (response) { return response.json();})
    .then(function (data) {
    //syntax of temp is identical to wind...but temperature text does not show...//update: fixed, leave out comma... why?
    cityName.text(cityCode);
    temp.text(data.current.temp + " Degrees Farenheit"); 
    wind.text(data.current.wind_speed + " MPH Wind");    
    humidity.text(data.current.humidity + "% Humidity");
    uvi.text(data.current.uvi + " UV Index")
    uvIndex.append(uvi)

//TODO: use loop in order to generate a card 5 different times with a +1 index value for each daily (sequential 5 day forecast)
//FORMAT: use "div" for each variable to generate on a different line
            //use index of 5 ceiling in order to limit to 5 cards
for (let i=0;i<5;i++){
    let weatherCard = $("<div>")
    $(".weather-cards").append(weatherCard)
    this["selectedDates"+i] = $("<div>")
    weatherCard.append((this["selectedDates"+i]));
    this["fiveCardTemperatures"+i] = $("<div>")
    weatherCard.append((this["fiveCardTemperatures"+i]));
    this["fiveCardWind"+i] = $("<div>")
    weatherCard.append((this["fiveCardWind"+i]));
    this["fiveCardHumidity"+i] = $("<div>")
    weatherCard.append((this["fiveCardHumidity"+i]));
    //add "* 1000" to stop date from showing as different years and adjust for sequential days
    this["fiveCardDay"+i] = new Date(data.daily[i].dt * 1000);
    //TODO copy equation to pull the next 5 days per card from the selected dates (user input+5)
    this["selectedDates"+i].text(this["fiveCardDay"+i]);
    this["fiveCardTemperatures"+i].text(data.daily[i].temp.day + " Farenheit");
    this["fiveCardWind"+i].text("Windspeed: "+ data.daily[i].wind_speed+ "mph");
    this["fiveCardHumidity"+i].text("Humidity: " + data.daily[i].humidity + " %");
    //TODO add CSS styling via targeted class to the five weather cards below
    weatherCard.addClass("weather-card")               
        }

     })
  })
}

//TODO users local storage info 
function weatherInfo() {
    let userStoredWeather =localStorage.getItem("city");
        freshList = JSON.parse(userStoredWeather);
        return freshList;
}
//TODO add info to local
function appendLocation (n) {
    let newEntry = weatherInfo();
    if (historyList.includes(selectedLocation) === false)
        {
            newEntry.push(n);
        }
    localStorage.setItem("city", JSON.stringify(newEntry));
};
//TODO Restrict Search History to 4 places in order to prevent list from building up
function printWeatherHistory () {
    let historyList = weatherInfo();
    for (let i = 0; i < 4; i++) {
        let selectedLocation = historyList[i];
        let weatherLocation =$("<div>")
        weatherLocation.attr('id',selectedLocation)
        weatherLocation.text(selectedLocation)
        $(".history").append(weatherLocation)
    }
};

printWeatherHistory();

