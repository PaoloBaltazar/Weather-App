async function displayWeather(location) {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if(!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    if (data.length === 0) {
      alert('City not found');

    }

    const lat = data[0].lat;
    const lon = data[0].lon;

    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data");
    }

    weatherData = await weatherResponse.json();
    console.log(weatherData);
  } 
  
  catch(e) {
    console.error(e)

  }

  const currentWeatherHTML = `
    <h1 class="temperature">${(Math.round(weatherData.main.temp) - 275.15).toFixed(0)}°C</h1>
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="weather condition" id="weatherCondition" class="">
    <h2 class="location">${weatherData.name}</h2>
  `

  document.querySelector('.js-current-weather').innerHTML = currentWeatherHTML;

  const weatherDetailsHTML = `
    <div class="weather-details">
      <p>Condition: </p>
      <p>${weatherData.weather[0].description}</p>
    </div>

    <div class="weather-details">
      <p>Humidity: </p>
      <p>${weatherData.main.humidity}%</p>
    </div>

    <div class="weather-details">
      <p>Pressure: </p>
      <p>${weatherData.main.pressure} hPa</p>
    </div>

    <div class="weather-details">
      <p>Wind Speed: </p>
      <p>${weatherData.wind.speed} km/h</p>
    </div>

    <div class="weather-details">
      <p>Wind Direction: </p>
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

  displayWeather(search);
})

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Enter'){
    const search = document.querySelector('.js-search-weather').value;

    displayWeather(search);
  }
})

displayWeather('guagua');




