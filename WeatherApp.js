import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function fetchLocation(location, isPreset = false) {

  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if(!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();
    console.log(data);

    if (data.length === 0) {
      alert('City not found');
    }

    if (data.length >= 1) {
      displayCityChoices(data, isPreset);
    }

    const { lat, lon } = data[0];
    fetchWeather(lat, lon, data[0].name, data[0].state);
  }
  
  catch(e) {
    console.error(e)

  }
  
}

function displayCityChoices(cities, isPreset = false) {
  const choicesContainer = document.querySelector('.js-city-choices');
  choicesContainer.innerHTML = '';

  cities.forEach((city, index) => {
    const choiceButton = document.createElement('button');
    choiceButton.innerHTML = `${city.name} (${city.state || 'N/A'})`;
    choiceButton.classList.add('city-choice-button');

    if(isPreset && index === 0) {
      choiceButton.classList.add('active');
      fetchWeather(city.lat, city.lon, city.name, city.state);
    }
    
    choiceButton.addEventListener('click', () => {
      document.querySelectorAll('.city-choice-button').forEach(button => button.classList.remove('active'));
      choiceButton.classList.add('active');
      fetchWeather(city.lat, city.lon, city.name, city.state);
    })
    choicesContainer.appendChild(choiceButton);
  })

}


async function fetchWeather(lat, lon, name, state) {
  let weatherData;
  try {
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data");
    }

    weatherData = await weatherResponse.json();
    renderWeather(weatherData, name, state);
    console.log(weatherData);
  }

  catch (e) {
    console.error(e);
  }
}

function renderWeather(weatherData, name, state) {
  const today = dayjs();
  const dateString = today.format('dddd, MMMM D');

  const currentWeatherHTML = `
    <div class="date-container">
      <p class="date">${dateString}</p>
    </div>

    <div class="current-weather">
      <h1 class="temperature">${(Math.round(weatherData.main.temp) - 275.15).toFixed(0)}°C</h1>
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather condition" id="weatherCondition" class="">
      <h2 class="city-name">${name}</h2>
      
    </div>
  `

  document.querySelector('.js-weather-container').innerHTML = currentWeatherHTML;

  const weatherDetailsHTML = `
    <div class="weather-details">
      <h3>CONDITION </h3>
      <p>${weatherData.weather[0].description}</p>
    </div>

    <div class="weather-details">
      <h3>HUMIDITY </h3>
      <p>${weatherData.main.humidity}%</p>
    </div>

    <div class="weather-details">
      <h3>PRESSURE </h3>
      <p>${weatherData.main.pressure} hPa</p>
    </div>

    <div class="weather-details">
      <h3>WIND SPEED </h3>
      <p>${weatherData.wind.speed} km/h</p>
    </div>

    <div class="weather-details">
      <h3>WIND DIRECTION </h3>
      <p>${getCardinalDirection(weatherData.wind.deg)}</p>
    </div>
  `

  document.querySelector('.js-weather-details-container').innerHTML = weatherDetailsHTML;
}

function getCardinalDirection(angle) {
  const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
  return directions[Math.round(angle / 45) % 8];
}

document.querySelector('.js-search-button').addEventListener('click', () => {
  const search = document.querySelector('.js-search-weather').value;
  
  fetchLocation(search, true);
  
})

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Enter'){
    const search = document.querySelector('.js-search-weather').value;
    
    fetchLocation(search, true);
    
    
  }
})

fetchLocation('guagua', true);




