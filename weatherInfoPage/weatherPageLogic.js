let cityParam;

$(function () {
    cityParam = getUrlParameter("city");
    $.getJSON("../config.json", function(json) {
        apiKey = json["weatherApiKey"];
        if (apiKey.indexOf(' ') >= 0 || apiKey === '') {
            $(".warningPopup").css("display", "flex");
            return;
        }
        updateValues(cityParam);
    });

});

const updateValues = (city) => getForecast(city, (response) => {
    const location = response["location"];
    const current = response["current"];
    const forecast = response["forecast"]["forecastday"];

    document.title += ` ${location["name"]}`;

    updateCurrentWeather(location, current, forecast[0]["day"])
    updateCurrentStats(current);
    updateForecast(forecast);
    updateWeatherBackground(Boolean(current["is_day"]), current["condition"]["text"]);
});

function updateCurrentWeather(location, current, currentDay) {
    $("#country").text(location["country"]);
    $("#cityStat").text(`${location["name"]}, ${formatIsoDate(location["localtime"])}`);
    $("#currentTemp").text(`${current["temp_c"]}°C`);
    $("#dayTemp").text(`${currentDay["mintemp_c"]}°C / ${currentDay["maxtemp_c"]}°C`);
    $("#currentStatus").text(currentDay["condition"]["text"]);
    $("#currentStatusImage").attr("src", scaleUpResolution(currentDay["condition"]["icon"]));
}

function updateCurrentStats(current) {
    $("#precipitation").text(`${current["precip_mm"]}mm`);
    $("#temp").text(`${current["temp_c"]}°C`);
    $("#windSpeed").text(`${roundTwoDecimals(current["wind_kph"] / 3.6)}m/h`);
    $("#humidity").text(`${current["humidity"]}%`);
    $("#indexUV").text(current["uv"]);
}

function updateForecast(forecast) {
    const dayElems = $("#forecast").children();

    for (let i = 0; i < 5; i++) {
        const currentChild = $(dayElems[i]);
        const currentDay = forecast[i];
        currentChild.find("> span").text(weekDayFromIsoDate(currentDay["date"]));
        currentChild.find("> img").attr("src", scaleUpResolution(currentDay["day"]["condition"]["icon"]))
        const values = $(currentChild.find(".values"));
        values.find("span:first-child").text(`${currentDay["day"]["maxtemp_c"]}°C`);
        values.find("span:last-child").text(`${currentDay["day"]["mintemp_c"]}°C`);
    }
}

function updateWeatherBackground(isDay, weatherCondition) {
    let filePath = "../../images/weatherBackgrounds/";

    if (weatherCondition.includes("partly cloudy")) filePath += "fewClouds";
    else if (weatherCondition.includes("cloudy")) filePath += "cloudy";
    else if (weatherCondition.includes("thunder")) filePath += "storm";
    else if (weatherCondition.includes("rain")) filePath += "rain";
    else filePath += "clear";

    if (!isDay) filePath += "Night";
    filePath += ".svg";

    document.body.style.setProperty("--weather-background", `url('${filePath}'`);
}

let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

function roundTwoDecimals(num) {
    return Math.round(num * 100) / 100;
}

function scaleUpResolution(imageUrl) {
    return imageUrl.replace("64x64", "128x128").replace("//", "https://");
}

function onWarningPopupSubmit() {
    apiKey = $("#keyInput").val();
    updateValues(cityParam);
    $(".warningPopup").css("display", "none");
}