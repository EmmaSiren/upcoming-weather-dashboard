// Set up empty array variable to store cities from search input
var cityHistoryArray = [];

// Add 'click' event listener to search button
$('.btn').click(function() {
  // Set 'city' variable to user input when search button is clicked
  var city = document.querySelector('.form-control').value;
  // Run 'getWeather' function using city as the parameter
  getWeather(city);
})

// Set 'getWeather' function with a required parameter of 'city'
function getWeather(city) {
  // Bring in API key and set it to a variable
  var APIKey = "3f62ce3b1bc74cc582fff8ac8274cf61";
  // Set API call URLs as concatenated strings that include the 'city' parameter to variables
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

  // Use fetch method to make API call for daily weather data
  fetch(queryURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    // Write 'timeConverter' function to get individual date data
    function timeConverter() {
      var a = new Date(data.dt * 1000);
      var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      // Concatenate date data into desired format
      var time = month + '/' + date + '/' + year;
      // Return date in desired format
      return time;
    }
    // Add border to daily weather weather section
    $('.today').css("border", "1px solid black");
    // Push concatenated data to HTML elements 
    $('.city').text(data.name + ' (' + (timeConverter()) + ') ');
    $('.city').append('<img>');
    $('img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    $('.temp').text('Temp: ' + data.main.temp + '°F');
    $('.wind').text('Wind: ' + data.wind.speed + ' MPH');
    $('.humidity').text('Humidity: ' + data.main.humidity + '%');
    $('.uvIndex').text('UV Index: ');

    // Grab required coordinate data from previous API call and set to variables
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    // Set API call for UV Index as concatenated string to a new variable using coordinate variables above
    var uviURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    // Use fetch method to make API call for UV Index
    fetch(uviURL).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      // Create span element to house UV Index badge and set to variable
      var UVbutton = document.createElement('span');
      // Set 'UVbutton's text as uvi data
      $(UVbutton).text(data.current.uvi);
      $(UVbutton).attr('class', 'badge');
      // Add badge with uvi data to element
      $('.uvIndex').append(UVbutton);

      // Set parameters for different badge colors depending on uvi data
      if (UVbutton.innerText > 6) {
        $(UVbutton).css('background-color', 'red');
      } else if (UVbutton.innerText >= 3) {
        $(UVbutton).css('background-color', 'gold');
      } else {
        $(UVbutton).css('background-color', 'green')
      }
    });
    
  });

  // Use fetch method to make API call for 5 day forecast
  fetch(forecastURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    // Clear any forecast data that was previously displayed
    $('.forecast').html('');

    // Loop to create five day forecast
    for (i = 0; i < 40; i++) {
      // Get only one timestamp per day
      if (data.list[i].dt_txt.split(' ')[1] === '12:00:00') {
        function timeConverter() {
          var a = new Date(data.list[i].dt * 1000);
          var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var time = month + '/' + date + '/' + year;
          return time;
        }

        // Display text
        $('.fiveDay').text('5-Day Forecast:')

        // Create elements for each day in 5 day forecast
        var daily = document.createElement('div');
        var date = document.createElement('p');
        var symbol = document.createElement('img');
        var temp = document.createElement('p');
        var wind = document.createElement('p');
        var humidity = document.createElement('p');
        var iconCode = data.list[i].weather[0].icon;
        $(daily).attr('class', 'card-body navy');
        $(symbol).attr('src', 'http://openweathermap.org/img/w/' + iconCode + '.png');
        // Set concatenated data to elements
        $(date).text(timeConverter());
        $(temp).text('Temp: ' + data.list[i].main.temp + '°F');
        $(wind).text('Wind: ' + data.list[i].wind.speed + ' MPH');
        $(humidity).text('Humidity: ' + data.list[i].main.humidity + '%');
        // Add a day to 5 day forecast section
        $('.forecast').append(daily);
        // Add all elements to each day
        daily.append(date, symbol, temp, wind, humidity);
      };
    };
    // Run 'storeCityHistory' function once 'getWeather' function has completed
    storeCityHistory();
  });

  // This function will store and display user search history
  function storeCityHistory() {
    // Do not run function if the search input is not a new input
    if (cityHistoryArray.indexOf(city) !== -1) {
      return;
    };
    // Add search input to 'cityHistoryArray'
    cityHistoryArray.push(city);
    // Set updated JSONified array to local storage
    localStorage.setItem('cityHistoryArray', JSON.stringify(cityHistoryArray));
    // Create button element for new search input and set it to a new variable
    var citiesContainer = document.createElement('button');
    $(citiesContainer).attr('class', 'btn btn-secondary btn-block')
    // Grab search inputs from local storage then add them as buttons to search history section
    for ( i = 0; i < cityHistoryArray.length; i++) {
      $(citiesContainer).text(JSON.parse(localStorage.getItem('cityHistoryArray'))[i]);
      $('.card-footer').append(citiesContainer);
    };
    // Add 'click' event listener to search history buttons then run 'getWeather' function using
    // that button's city as the new parameter when clicked
    $(citiesContainer).click(function() { getWeather(this.innerText) });
  };
};