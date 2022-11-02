var cityHistoryArray = [];

$('.btn').click(function() {
  var city = document.querySelector('.form-control').value;
  getWeather(city);
})

function getWeather(city) {
  var APIKey = "3f62ce3b1bc74cc582fff8ac8274cf61";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

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
    $('.today').css("border", "1px solid black");
    $('.city').text(data.name + ' (' + (timeConverter()) + ') ');
    $('.city').append('<img>');
    $('img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    $('.temp').text('Temp: ' + data.main.temp + '°F');
    $('.wind').text('Wind: ' + data.wind.speed + ' MPH');
    $('.humidity').text('Humidity: ' + data.main.humidity + '%');
    $('.uvIndex').text('UV Index: ');

    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var uviURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    fetch(uviURL).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      var UVbutton = document.createElement('span');
      $(UVbutton).text(data.current.uvi);
      $(UVbutton).attr('class', 'badge');
      $('.uvIndex').append(UVbutton);

      if (UVbutton.innerText > 6) {
        $(UVbutton).css('background-color', 'red');
      } else if (UVbutton.innerText >= 3) {
        $(UVbutton).css('background-color', 'gold');
      } else {
        $(UVbutton).css('background-color', 'green')
      }
    });
    
  });

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

        $('.fiveDay').text('5-Day Forecast:')

        var daily = document.createElement('div');
        var date = document.createElement('p');
        var symbol = document.createElement('img');
        var temp = document.createElement('p');
        var wind = document.createElement('p');
        var humidity = document.createElement('p');
        var iconCode = data.list[i].weather[0].icon;
        $(daily).attr('class', 'card-body navy');
        $(symbol).attr('src', 'http://openweathermap.org/img/w/' + iconCode + '.png');
        $(date).text(timeConverter());
        $(temp).text('Temp: ' + data.list[i].main.temp + '°F');
        $(wind).text('Wind: ' + data.list[i].wind.speed + ' MPH');
        $(humidity).text('Humidity: ' + data.list[i].main.humidity + '%');
        $('.forecast').append(daily);
        daily.append(date, symbol, temp, wind, humidity);
      };
    };
    storeCityHistory();
  });

  function storeCityHistory() {
    console.log(cityHistoryArray.indexOf(city));
    if (cityHistoryArray.indexOf(city) !== -1) {
      return;
    };
    cityHistoryArray.push(city);
    localStorage.setItem('cityHistoryArray', JSON.stringify(cityHistoryArray));
    var citiesContainer = document.createElement('button');
    $(citiesContainer).attr('class', 'btn btn-secondary btn-block')
    for ( i = 0; i < cityHistoryArray.length; i++) {
      $(citiesContainer).text(JSON.parse(localStorage.getItem('cityHistoryArray'))[i]);
      $('.card-footer').append(citiesContainer);
    };
    $(citiesContainer).click(function() { getWeather(this.innerText) });
  };
};