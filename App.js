// Constants for the app
const WEATHER_API_ROOT_URL = 'https://api.openweathermap.org';
const WEATHER_API_KEY = 'e9c674006ee239e863f114ca3b7c9241';

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
    if (!event.target.matches('.hisBUTT')) return;

    const cityName = event.target.getAttribute('wya');
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
        historyButton.classList.add('button', 'is-light', 'mb-2', 'hisBUTT');
        historyButton.setAttribute('title', 'Click to re-search this city');
        historyButton.setAttribute('wya', searchHistoryList[i]);
        historyButton.textContent = searchHistoryList[i];
        searchHistoryEl.append(historyButton);
    }
    hideEmptyElements();
};

function displayWeatherData(city, data) {
    displayCurrentWeather(city, data.list[0]);
    displayForecast(data.list);
    hideEmptyElements();
};

function displayCurrentWeather(city, weatherData) {
    currentWeatherEl.innerHTML = '';

    const weatherBox = document.createElement('div');
    weatherBox.classList.add('box');

    const date = dayjs.unix(weatherData.dt).tz(weatherData.timezone).format('M/D/YYYY');
    const iconUrl = `${WEATHER_API_ROOT_URL}/img/w/${weatherData.weather[0].icon}.png`;
    const description = weatherData.weather[0].description;
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    const cityEl = document.createElement('h2');
    cityEl.textContent = `${city} (${date})`;
    weatherBox.appendChild(cityEl);

    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl);
    iconEl.setAttribute('alt', description);
    weatherBox.appendChild(iconEl);

    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${temp}°F`;
    weatherBox.appendChild(tempEl);

    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${humidity}%`;
    weatherBox.appendChild(humidityEl);

    const windSpeedEl = document.createElement('p');
    windSpeedEl.textContent = `Wind Speed: ${windSpeed} MPH`;
    weatherBox.appendChild(windSpeedEl);

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = `Description: ${description}`;
    weatherBox.appendChild(descriptionEl);

    currentWeatherEl.appendChild(weatherBox);
};


function displayForecast(dailyForecast) {
    forecastEl.innerHTML = '';

    for (let i = 1; i < dailyForecast.length; i += 8) {
        const dailyData = dailyForecast[i];

        const date = dayjs.unix(dailyData.dt).tz(dailyData.timezone).format('M/D/YYYY');
        const iconUrl = `https://openweathermap.org/img/w/${dailyData.weather[0].icon}.png`;
        const description = dailyData.weather[0].description;
        const temp = dailyData.main.temp;
        const humidity = dailyData.main.humidity;

        const forecastCardEl = document.createElement('div');
        forecastCardEl.classList.add('box', 'forecast-card', 'mb-3');

        const dateEl = document.createElement('h4');
        dateEl.textContent = date;
        forecastCardEl.appendChild(dateEl);

        const iconEl = document.createElement('img');
        iconEl.setAttribute('src', iconUrl);
        iconEl.setAttribute('alt', description);
        forecastCardEl.appendChild(iconEl);

        const tempEl = document.createElement('p');
        tempEl.textContent = `Temp: ${temp}°F`;
        forecastCardEl.appendChild(tempEl);

        const humidityEl = document.createElement('p');
        humidityEl.textContent = `Humidity: ${humidity}%`;
        forecastCardEl.appendChild(humidityEl);

        forecastEl.appendChild(forecastCardEl);
    }
};

function hideEmptyElements() {
    const elements = [currentWeatherEl, forecastEl, searchHistoryEl];

    elements.forEach(el => {
        if (!el.innerHTML.trim()) {
            el.style.display = 'none';
        } else {
            el.style.display = 'block';
        }
    });
}


loadSearchHistory();
searchFormEl.addEventListener('submit', onSearchFormSubmit);
searchHistoryEl.addEventListener('click', onSearchHistoryClick);