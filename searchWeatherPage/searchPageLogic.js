const autocompleteList = $("#autocompleteList");
const searchInput = $("#searchCityInput");

$(function() {
    $.getJSON("../config.json", function(json) {
        apiKey = json["weatherApiKey"];
        if (apiKey.indexOf(' ') >= 0 || apiKey === '') $(".warningPopup").css("display", "flex");
        searchInput.on("input", event => updateCities(event.target.value));
    });

});
function updateCities(keyword) {
    searchCities(keyword, cities => {
        autocompleteList.empty();
        cities.forEach(city => {
            const newCity = document.createElement("li");
            $(newCity).on("click", () => openWeatherPage(city["url"]));
            $(newCity).text(formatCityObject(city));
            autocompleteList.append(newCity);
        });
    });
}

function openWeatherPage(city) {
    window.location.href = `../weatherInfoPage/index.html?city=${city}`;
}

function onWarningPopupSubmit() {
    apiKey = $("#keyInput").val();
    $(".warningPopup").css("display", "none");
}