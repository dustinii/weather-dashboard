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

function fetchWeatherData(coords){};

function fetchCityCoords(city){};

function onSearchFormSubmit(event){};

function onSearchHistoryClick(event){};

function loadSearchHistory(){};

function updateSearchHistory(city){};

function displaySearchHistory(){};

function displayWeatherData(city, data){};

function displayCurrentWeather(city, weatherData){};

function displayForecast(dailyForecast){};

loadSearchHistory();
searchFormEl.addEventListener('submit', onSearchFormSubmit);
searchHistoryEl.addEventListener('click', onSearchHistoryClick);