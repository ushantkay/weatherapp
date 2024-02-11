let weather = {
    apiKey: "00c6c772f82ddfd7a6658ed3c9571dfd",
    fetchWeather: function(city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity, feels_like} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerText = `Weather in   ${name}`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "° C";
        document.querySelector(".feels_like").innerText = `Feels Like: ${feels_like}°C`
        document.querySelector(".humidity").innerText = `Humidity: ${humidity} %`;
        document.querySelector(".wind").innerText = `Wind: ${speed} m/s`;
        document.querySelector(".weather").classList.remove("loading");
    },
    fetchForecast: function(city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
        )
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch forecast");
            }
            return response.json();
        })
        .then(data => {
            this.displayForecast(data);
        })
        .catch(error => console.error("Error fetching forecast:", error));
    },
    displayForecast: function(data) {
        const dailyForecasts = data.list;
        const uniqueDays = {};
        // Get data to be displayed for each day
        dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });

        if (!uniqueDays[day]) {
            uniqueDays[day] = {
                icon: forecast.weather[0].icon,
                tempMin: Infinity,
                tempMax: -Infinity,
            };
          }
      
          uniqueDays[day].tempMin = Math.min(uniqueDays[day].tempMin, forecast.main.temp_min);
          uniqueDays[day].tempMax = Math.max(uniqueDays[day].tempMax, forecast.main.temp_max);
        });
    
        const forecastContainer = document.querySelector(".forecast .forecast-container");
        forecastContainer.innerHTML = "";
    
        for (const [day, { icon,tempMin, tempMax}] of Object.entries(uniqueDays)) {
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
        const forecastElement = `
            <div class="forecast-item">
            <img src="${iconUrl}" alt="${day} icon">
            <span class="day">${day}</span>
            <span class="temp">${Math.round(tempMin)}°C</span>
            <span class="temp">${Math.round(tempMax)}°C</span>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', forecastElement);
        }
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
        this.fetchForecast(document.querySelector(".search-bar").value);
    }
};

// Input
document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search();
    }     
});

// Default Weather
weather.fetchWeather("pune");
weather.fetchForecast("pune");