var cityHistory = [];
var submitCity = document.querySelector('.btn');

function getWeather() {
  var city = document.querySelector('.input').value;
  var APIKey = "3f62ce3b1bc74cc582fff8ac8274cf61";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
  // var uviURL = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=" + APIKey;
  var forecast = $('.forecast');

  fetch(queryURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    function timeConverter() {
      var a = new Date(data.dt * 1000);
      var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var time = month + '/' + date + '/' + year;
      return time;
    }
    $('.city').text(data.name + ' (' + (timeConverter()) + ') ');
    $('.city').append('<img>');
    $('img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    $('.temp').text('Temp: ' + data.main.temp + '°F');
    $('.wind').text('Wind: ' + data.wind.speed + ' MPH');
    $('.humidity').text('Humidity: ' + data.main.humidity + '%');
  });



  // fetch (uviURL).then(function(response) {
  //     return response.json();
  // }).then(function (data) {
  //     console.log(data);
  //     $('.uvIndex').text('UVI Index: ' + data.current.uvi);
  // });

  fetch(forecastURL).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    $('.forecast').html('');

    // Loop to create five day forecast
    for (i = 0; i < 40; i++) {
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

        var city = document.createElement('h1');
        var daily = document.createElement('div');
        var date = document.createElement('h2');
        var symbol = document.createElement('img');
        var temp = document.createElement('h3');
        var wind = document.createElement('h3');
        var humidity = document.createElement('h3');
        var iconCode = data.list[i].weather[0].icon;
        symbol.setAttribute('src', 'http://openweathermap.org/img/w/' + iconCode + '.png');
        $(date).text(timeConverter());
        $(temp).text('Temp: ' + data.list[i].main.temp + '°F');
        $(wind).text('Wind: ' + data.list[i].wind.speed + ' MPH');
        $(humidity).text('Humidity: ' + data.list[i].main.humidity + '%');
        $(city).text('City: ' + data.city.name)
        forecast.append(daily);
        daily.append(date, city, symbol, temp, wind, humidity);
      };
    };
  });

  console.log(cityHistory.indexOf(city));
  if (cityHistory.indexOf(city) !== -1) {
    return;
  }
  cityHistory.push(city);
  localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
  var test1 = document.createElement('div');

  for ( i = 0; i < cityHistory.length; i++) {
    $(test1).text(JSON.parse(localStorage.getItem('cityHistory'))[i]);
    $('.card-footer').append(test1);
  };


};
submitCity.addEventListener('click', getWeather);