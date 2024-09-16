const apiKey = 'API key '; // Your OpenWeather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const toggleUnitButton = document.getElementById('toggleUnit');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIconElement = document.getElementById('weather-icon');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const forecastContainer = document.getElementById('hourly-forecast');

let isCelsius = true;

// Search button for city-based weather
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
        fetchHourlyForecast(location);
    }
});

// Geolocation weather on page load
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        });
    }
});

// Toggle between Celsius and Fahrenheit
toggleUnitButton.addEventListener('click', () => {
    isCelsius = !isCelsius;
    const location = locationInput.value || locationElement.textContent;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchWeatherByCoords(lat, lon) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchHourlyForecast(location) {
    const url = `${forecastUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                displayHourlyForecast(data.list);
            }
        })
        .catch(error => {
            console.error('Error fetching hourly forecast:', error);
        });
}

function updateWeather(data) {
    locationElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
    descriptionElement.textContent = data.weather[0].description;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    windElement.textContent = `Wind: ${data.wind.speed} m/s`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

    changeBackground(data.weather[0].description);
}

// More granular weather condition background change
function changeBackground(weatherDescription) {
    const body = document.body;
    
    switch (weatherDescription) {
        case 'clear sky':
            body.style.backgroundImage = "url('https://wallpapercave.com/wp/wp5544455.jpg')";
            break;
        case 'few clouds':
            body.style.backgroundImage = "url('https://wallpaperaccess.com/full/530682.jpg')";
            break;
        case 'scattered clouds':
            body.style.backgroundImage = "url('https://c1.staticflickr.com/3/2106/1909487867_de140c7eb8_b.jpg')";
            break;
        case 'broken clouds':
            body.style.backgroundImage = "url('https://live.staticflickr.com/1828/28636482297_bd428f26e8_b.jpg')";
            break;
        case 'overcast clouds':
            body.style.backgroundImage = "url('https://wallup.net/wp-content/uploads/2016/02/18/273327-nature-clouds-overcast-sky.jpg')";
            break;
        case 'light rain':
            body.style.backgroundImage = "url('https://wallpapercave.com/wp/wp7226478.jpg')";
            break;
        case 'moderate rain':
            body.style.backgroundImage = "url('https://www.loudmeyell.com/wp-content/uploads/2013/03/Nature-rain-Photography.jpg')";
            break;
        case 'heavy intensity rain':
            body.style.backgroundImage = "url('https://climate.state.mn.us/sites/climate-action/files/styles/max_1750_x_1750/public/2020-07/Heavy-Rain-iStock-494205797.jpg?itok=zN_6d4Na')";
            break;
        case 'freezing rain':
            body.style.backgroundImage = "url('https://media.wbur.org/wp/2022/02/0204_storm03.jpg')";
            break;
        case 'light snow':
            body.style.backgroundImage = "url('https://img.goodfon.com/wallpaper/nbig/5/50/snow-night-frost-winter-noch-sneg-zima-moroz.webp')";
            break;
        case 'heavy snow':
            body.style.backgroundImage = "url('https://www.publicdomainpictures.net/pictures/390000/velka/heavy-snow-1615819839yKH.jpg')";
            break;
        case 'sleet':
            body.style.backgroundImage = "url('https://www.photos-public-domain.com/wp-content/uploads/2018/08/ice-cubes-on-the-ground.jpg')";
            break;
        case 'shower rain':
            body.style.backgroundImage = "url('https://images5.alphacoders.com/312/312372.jpg')";
            break;
        case 'thunderstorm with rain':
            body.style.backgroundImage = "url('https://odishabhaskar.com/wp-content/uploads/2020/03/Thunderstorm-with-rain-in-10.jpg')";
            break;
        default:
            body.style.backgroundImage = "url('https://www.saga.co.uk/contentlibrary/saga/publishing/verticals/technology/apps/shutterstock_240459751.jpg')";
            break;
    }
}

function displayHourlyForecast(forecastData) {
    forecastContainer.innerHTML = ''; // Clear previous forecast
    forecastData.slice(0, 5).forEach(forecast => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const time = new Date(forecast.dt * 1000).getHours() + ':00'; // Convert timestamp to hour
        const temp = `${Math.round(forecast.main.temp)}°C`;
        const description = forecast.weather[0].description;

        forecastItem.innerHTML = `<p>${time}</p><p>${temp}</p><p>${description}</p>`;
        forecastContainer.appendChild(forecastItem);
    });
}
