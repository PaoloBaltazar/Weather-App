async function displayWeather(location) {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if(!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();
    const lat = data[0].lat;
    const lon = data[0].lon;

    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2a673f32af562f1ccf725c50134cb8e1`)

    if (!weatherResponse.ok) {
      throw new Error("Could not fetch weather data");
    }

    weatherData = await weatherResponse.json();

    console.log(weatherData);

  } 
  
  catch {

  }

}

document.querySelector('.js-search-button').addEventListener('click', () => {
  const search = document.querySelector('.js-search-weather').value;

  displayWeather(search);

  

  
})
