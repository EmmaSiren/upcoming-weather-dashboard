var APIKey = "3f62ce3b1bc74cc582fff8ac8274cf61";
var city = 'Anaheim';
var state;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
var forecast = $('.forecast');

fetch(queryURL).then(function (response) {
    return response.json();
}).then(function (data) {
    // console.log(data);
    $('.city').text(data.name);
    $('.temp').text(data.main.temp);
    $('.wind').text(data.wind.speed);
    $('.humidity').text(data.main.humidity);
    // $('.uvIndex').text(data.uvi);
});

fetch(forecastURL).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);

        // Loop to create five day forecast
    for (i = 0; i < 40; i++) {
        if (data.list[i].dt_txt.split(' ')[1] === '12:00:00') {
            function timeConverter(){
                var a = new Date(data.list[i].dt * 1000);
                var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var time = month + '/' + date + '/' + year;
                return time;
            }

            var daily = document.createElement('div');
            var date = document.createElement('h2');
            var symbol = document.createElement('img');
            var temp = document.createElement('h3');
            var wind = document.createElement('h3');
            var humidity = document.createElement('h3');
            var iconCode = data.list[i].weather[0].icon;
            symbol.setAttribute('src', 'http://openweathermap.org/img/w/' + iconCode + '.png' );
            $(date).text(timeConverter());
            $(temp).text('Temp: ' + data.list[i].main.temp + ' °F');
            $(wind).text('Wind: ' + data.list[i].wind.speed + ' MPH');
            $(humidity).text('Humidity: ' + data.list[i].main.humidity + '%');
            forecast.append(daily);
            daily.append(date);
            daily.append(symbol);
            daily.append(temp);
            daily.append(wind);
            daily.append(humidity);
        };
    };
});