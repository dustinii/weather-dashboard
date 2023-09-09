// Constants for the app
const WEATHER_API_ROOT_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = '';

const HISTORY_KEY = 'search-history';
let searchHistoryList = [];

// DOM elements
const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-input');
const currentWeatherEl = document.querySelector('#today');
const forecastEl = document.querySelector('#forecast');
const searchHistoryEl = document.querySelector('#history');

// dayjs plugin
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

function fetchWeatherData(coords) {
    const apiUrl = `${WEATHER_API_ROOT_URL}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${WEATHER_API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeatherData(coords.name, data))
        .catch(err => console.error(err));
}

function fetchCityCoords(city) {
    const apiUrl = `${WEATHER_API_ROOT_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${WEATHER_API_KEY}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data[0]) {
                alert('Location not found');
            } else {
                updateSearchHistory(city);
                fetchWeatherData(data[0]);
            }
        })
        .catch(error => console.error(error));
};

function onSearchFormSubmit(event) {
    event.preventDefault();
    const cityName = searchInputEl.value.trim();
    if (!cityName) return;

    fetchCityCoords(cityName);
    searchInputEl.value = '';

};

function onSearchHistoryClick(event) {
    if (!event.target.matches('.btn-history')) return;

    const cityName = event.target.getAttribute('data-search');
    fetchCityCoords(cityName);
};

function loadSearchHistory() {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
        searchHistoryList = JSON.parse(storedHistory);
        displaySearchHistory();
    }
};

function updateSearchHistory(city) {
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistoryList));
        displaySearchHistory();
    }
};

function displaySearchHistory() {
    searchHistoryEl.innerHTML = '';
    for (let i = searchHistoryList.length - 1; i >= 0; i--) {
        const historyButton = document.createElement('button');
        historyButton.setAttribute('type', 'button');
        historyButton.setAttribute('aria-controls', 'today forecast');
        historyButton.classList.add('history-btn', 'btn-history');
        historyButton.setAttribute('data-search', searchHistoryList[i]);
        historyButton.textContent = searchHistoryList[i];
        searchHistoryEl.append(historyButton);
    }
};

function displayWeatherData(city, data) {
    displayCurrentWeather(city, data.list[0]);
    displayForecast(data.list);
};

function displayCurrentWeather(city, weatherData) { 
    currentWeatherEl.innerHTML = '';

    const date = dayjs.unix(weatherData.dt).tz(weatherData.timezone).format('M/D/YYYY');
    const iconUrl = `${WEATHER_API_ROOT_URL}/img/wn/${weatherData.weather[0].icon}.png`;
    const description = weatherData.weather[0].description;
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    const cityEl = document.createElement('h2');
    cityEl.textContent = `${city} (${date})`;
    currentWeatherContainerEl.appendChild(cityEl);

    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl);
    iconEl.setAttribute('alt', description);
    currentWeatherContainerEl.appendChild(iconEl);

    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${temp}°F`;
    currentWeatherContainerEl.appendChild(tempEl);

    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity}%`;
    currentWeatherContainerEl.appendChild(humidityEl);

    const windSpeedEl = document.createElement('p');
    windSpeedEl.textContent = `Wind Speed: ${windSpeed} MPH`;
    currentWeatherContainerEl.appendChild(windSpeedEl);

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = `Description: ${description}`;
    currentWeatherContainerEl.appendChild(descriptionEl);
};

function displayForecast(dailyForecast) { };

loadSearchHistory();
searchFormEl.addEventListener('submit', onSearchFormSubmit);
searchHistoryEl.addEventListener('click', onSearchHistoryClick);