let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
const apiKey = '2c943e80f9ecb048945b2bd79eb153e8';

// gets the forcast using the city name and then getting the longitude and latitude form the city name
function getForecasts(city) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // fetches the data from the api using the city returns a message if the city was an invalid entry otherwise it returns the data
    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error finding city');
            }
            return response.json();
        })
        // takes the data and extracts the longitude and coordinates from it
        .then(function(response) {
            let longitude = response.coord.lon;
            let latitude = response.coord.lat;

            console.log('This is the lon and lat: ' + 'lon: ' + longitude + 'lat: ' + latitude);
                
            getCurrentForcast(latitude, longitude, city);
            getFiveDayForecast(latitude, longitude, city);
            saveSearchHistory(city);
        })
}

function getCurrentForcast(latitude, longitude, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Could not generate a response: Line 41');
            }
            return response.json();
        })

        .then(function(response) {
            let currentDay = moment().format('M/D/YYYY');

            let currentForecast = $('<div>')
                .addClass('current-forecast');

            let currentCity = $('<h3>')
                .text(`${city}, (${currentDay})`);

            let currentTemp = $('<h5>')
                .text('Temperature: ' + response.list[0].main.temp + '°F');

            let currentWindSpeed = $('<h5>')
                .text('Wind Speed: ' + response.list[0].wind.speed + 'MPH');

            let currentHumidity = $('<h5>')
                .text('Humidity: ' + response.list[0].main.humidity + '%');

            currentForecast.append(currentCity, currentTemp, currentWindSpeed, currentHumidity);
            $('#current-forecast').append(currentForecast);
        })
        .catch(e => {
            console.log(e);
        });    
}

function getFiveDayForecast(latitude, longitude, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Could not generate a response: Line 77');
            }
            return response.json();
        })

        .then(function(response) {
            let dailyForecast = $('<div>')
                .addClass('five-day-forecast');

            console.log('response', response);

            for (let i = 0; i < response.list.length; i++) {
                // let weatherCard = createWeatherCard(response.list[i].temp, response.list[i].wind_speed, response.list[i].humidity, city, response.list[i].dt);
                // dailyForecast.append(weatherCard);
                let currentTime = response.list[i].dt_txt;

                if(currentTime.includes('12:00:00')) {
                    // console.log(response.list[i].main.temp); 
                    let currentTemp = $('<p>')
                    .text('Temperature: ' + response.list[i].main.temp + '°F');

                    let currentWindSpeed = $('<p>')
                    .text('Wind Speed: ' + response.list[i].wind.speed + 'MPH');
    
                    let currentHumidity = $('<p>')
                    .text('Humidity: ' + response.list[i].main.humidity + '%');

                    dailyForecast.append(currentTemp, currentWindSpeed, currentHumidity);
                    $('#current-forecast').append(dailyForecast);
                }
            }
            $('#weekly-forecast').append(dailyForecast);
        })
}

function saveSearchHistory(city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        
        // reload the search history
        loadSearchHistory();
        console.log('Search history loaded...');
    }
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    let historyContainer = $('<div>')
        .addClass('searchedContainer');

    for (var i = 0; i < searchHistory.length; i++) {
        let searchedCity = $('<p>')
            .addClass('searched-city')
            .text(searchHistory[i]);

        historyContainer.append(searchedCity);
    }
    $('#search-history').append(historyContainer);
}

function createWeatherCard(temperature, windSpeed, humidity, city, currentDay) {
    
    let dailyForecast = $('<div>')
        .addClass('daily-forecast');

    let day = $('<p>')
        .text(`${city}, (${currentDay})`);

    let dailyTemp = $('<p>')
        .text('Temperature: ' + temperature + '°F');

    let dailyWindSpeed = $('<p>')
        .text('Wind Speed: ' + windSpeed + 'MPH');

    let dailyHumidity = $('<p>')
        .text('Humidity: ' + humidity + '%');

    dailyForecast.append(day, dailyTemp, dailyWindSpeed, dailyHumidity);

    return dailyForecast;
}

$('#search-field').on("submit", function() {
    event.preventDefault();

    let city = $('#search-bar').val();

    if (city == null || city === '') {
        alert('Please enter a valid city');
        event.preventDefault();
    }
    else {
        getForecasts(city);
    }
})

$("#search-history").on("click", "p", function() {
    let searchedCity = $(this).text();
    getForecasts(searchedCity);
});

loadSearchHistory();