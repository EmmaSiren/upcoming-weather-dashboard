var APIKey = "3f62ce3b1bc74cc582fff8ac8274cf61";
var city = 'Anaheim';
var state;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
var forecast = $('.forecast');

fetch(queryURL).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
    function timeConverter(){
        var a = new Date(data.dt * 1000);
        var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + '/' + date + '/' + year;
        return time;
    }
    $('.city').text(data.name + ' (' + (timeConverter()) + ') ');
    $('.city').append('<img>');
    $('img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    $('.temp').text('Temp: ' + data.main.temp);
    $('.wind').text('Wind: ' + data.wind.speed);
    $('.humidity').text('Humidity: ' + data.main.humidity);
});

// fetch ('https://api.openweathermap.org/data/2.5/onecall?&appid=' + APIKey).then(function(response) {
//     return response.json();
//     }).then(function(data) {
//     // $('.uvIndex').text('UV Index: ' + data.current.uvi);
//     console.log(data);
// });

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
            symbol.setAttribute('src', 'http://openweathermap.org/img/w/' + iconCode + '.png');
            $(date).text(timeConverter());
            $(temp).text('Temp: ' + data.list[i].main.temp + ' °F');
            $(wind).text('Wind: ' + data.list[i].wind.speed + ' MPH');
            $(humidity).text('Humidity: ' + data.list[i].main.humidity + '%');
            forecast.append(daily);
            daily.append(date, symbol, temp, wind, humidity);
        };
    };
});