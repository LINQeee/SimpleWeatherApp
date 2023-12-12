let apiKey = '';

const baseUrl = "https://api.weatherapi.com/v1/";

function searchCities(keyWord, callback) {
    $.get({
        url: `${baseUrl}search.json`,
        data: {
            key: apiKey,
            q: keyWord ? keyWord : " "
        },
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            console.error(error);
        }
    });
}

function getForecast(city, callback) {
    $.get({
        url: `${baseUrl}forecast.json`,
        data: {
            key: apiKey,
            q: city ? city : " ",
            days: 5
        },
        success: function(response) {
            callback(response);
        },
        error: function (error) {
            console.error(error);
        }
    });
}