
const apiResource = {
    weatherApi: " https://api.weatherapi.com/v1",
    weatherApiKey: "fea727a39dfa4c9897a54836241905",
    countryApi: "https://countriesnow.space/api/v0.1/countries"
}

const elements = {
    loader: document.querySelector(".loader"),
    inputField: document.querySelector(".inputField"),
    tempField: document.querySelector(".temp"),
    fellField: document.querySelector(".fell"),
    conditionImg: document.querySelector(".conditionImg"),
    conditionText: document.querySelector(".conditionText"),
    searchBtn: document.querySelector(".searchBtn"),
    selectOption: document.querySelector(".selectOption"),
    selectedCity: document.querySelector('.selectCity'),
    cityName: document.querySelector(".cityName"),
    countryName: document.querySelector(".countryName"),
    chanceOfRaining: document.querySelector(".rainChance"),
    sunrise: document.querySelector(".sunrise"),
    sunset: document.querySelector(".sunset"),
    forecast: document.querySelector(".forecastSection"),
    activeForeCast: document.querySelector(".day.active"),
    rainProbabilityField: document.querySelector(".rainProbabilty"),
    sunriseForeCast: document.querySelector(".forecastSunrise"),
    sunsetForecast: document.querySelector(".forecastSunset"),
    avgTempForecast: document.querySelector(".foreCastAvgTemp"),
    hightTempForecast: document.querySelector(".highTempFeild"),
    lowestTempForecast: document.querySelector(".lowestTempFeild"),
    statusForeCast: document.querySelector(".status"),
    uvForeCast: document.querySelector(".uv-forecast"),
    humidityForecast: document.querySelector(".humidity-forecast"),
    todayHightTemp: document.querySelector(".todayHeightTemp"),
    todayLowestTemp: document.querySelector(".todayLowestTemp"),
    todayHumidity: document.querySelector(".todayHumidity"),
    todayUv: document.querySelector(".todayUv"),


}


const cityList = []
let foreCastLists = []

const loadCityList = async () => {
    try {
        const countryList = await fetch(apiResource.countryApi)
        const { data } = await countryList.json()
        await data.forEach((country) => country.cities.forEach((city) => cityList.push(city)))
    } catch (error) {
        console.log(error)
    }
}
loadCityList()

const getCurrentWeather = async (city) => {
    const weatherData = await fetch(`${apiResource.weatherApi}/forecast.json?key=${apiResource.weatherApiKey}&q=${city}&days=5`)
    const data = await weatherData.json()
    return data
}

const handleForecast = (day, div) => {
    updateTheForecastPart(day)
    const data = document.querySelector(".day.active")
    const partiCularDay = div.querySelector(".day")
    data.classList.remove("active")
    partiCularDay.classList.add("active")
}

const updateWeatherPage = async (city = "dhaka") => {

    elements.forecast.innerHTML = ''

    foreCastLists = []
    try {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const { current, location, forecast } = await getCurrentWeather(city)
        const currentWeather = forecast.forecastday[0]
        console.log(currentWeather, "current");
        // console.log(location, "location");
        // console.log(forecast, "forecast");
        document.body.style.backgroundImage = current.is_day ? "url('../../assets/images/day.jpg')" : "url('../../assets/images/night.jpg')"
        elements.tempField.innerText = current.temp_c + "°C"
        elements.conditionImg.src = `https://${current.condition.icon}`
        elements.conditionText.innerText = current.condition.text
        elements.countryName.innerText = location.country
        elements.fellField.innerText = current.feelslike_c + "°C"
        elements.cityName.innerText = location.name
        elements.chanceOfRaining.innerText = `${currentWeather.day.daily_chance_of_rain}  % `
        elements.sunrise.innerText = currentWeather.astro.sunrise
        elements.sunset.innerText = currentWeather.astro.sunset
        elements.todayHightTemp.innerText = currentWeather.day.maxtemp_c
        elements.todayLowestTemp.innerText = currentWeather.day.mintemp_c
        elements.todayHumidity.innerText = currentWeather.day.avghumidity
        elements.todayUv.innerText = currentWeather.day.uv
        forecast.forecastday.forEach((day, index) => {

            if (index !== 0) {
                foreCastLists.push(day)
                if (index === 1) updateTheForecastPart(day)
                const div = document.createElement("div")
                div.className = "forecast"
                const dayName = dayNames[new Date(day.date_epoch * 1000).getDay()]
                div.innerHTML = `
                <div class="day ${index === 1 ? "active" : ""}">
                    <p class="date">${day.date}</p>
                    <img src="https://${day.day.condition.icon}">
                    <h4>${day.day.avgtemp_c} °C</h4>
                    <p class="dayName">${dayName}</p>
                </day>
                
                `
                div.addEventListener("click", () => {
                    handleForecast(day, div)
                })
                elements.forecast.appendChild(div)
            }

        })

    } catch (error) {
        console.log(error);
    }

}

const updateTheForecastPart = (day) => {
    elements.rainProbabilityField.innerText = day.day.daily_chance_of_rain + " %"
    elements.sunriseForeCast.innerText = day.astro.sunrise
    elements.sunsetForecast.innerText = day.astro.sunset
    elements.hightTempForecast.innerText = day.day.maxtemp_c
    elements.lowestTempForecast.innerText = day.day.mintemp_c
    elements.statusForeCast.innerText = day.day.condition.text
    elements.avgTempForecast.innerText = day.day.avgtemp_c
    elements.uvForeCast.innerText = day.day.uv
    elements.humidityForecast.innerText = day.day.avghumidity

}






window.addEventListener("keyup", (e) => {
    const selectElement = elements.selectOption
    selectElement.innerHTML = ''
    const inputValue = elements.inputField.value
    const matchCityList = []
    const cityLength = cityList.length
    if (inputValue) {
        for (let i = 0; i < cityLength; i++) {
            const city = cityList[i].toLowerCase();
            if (city.startsWith(inputValue.toLowerCase())) {
                matchCityList.push(city);
            }
            if (matchCityList.length > 4) break
        }
    }

    console.log(matchCityList);
    console.log(matchCityList.length);
    if (matchCityList.length) {
        matchCityList.forEach((element) => {
            const li = document.createElement("li")
            li.textContent = element
            li.className = "selectCity"
            li.onclick = (e) => handleSelect(e)
            selectElement.appendChild(li)
        })
    }

    else {
        selectElement.innerHTML = ''
    }


})

elements.searchBtn.addEventListener("click", () => {
    const inputValue = elements.inputField.value
    if (!inputValue) return alert("Please enter city name")
    updateWeatherPage(inputValue)
    elements.selectOption.innerHTML = ''
    elements.inputField.value = ''
})



const handleSelect = async (e) => {
    const city = e.target.textContent
    elements.inputField.value = city
    await updateWeatherPage(city)
    elements.selectOption.innerHTML = ''
    elements.inputField.value = ''

}


updateWeatherPage()


window.addEventListener("load", () => {
    elements.loader.style.display = "none"
    console.log("hey");
})
