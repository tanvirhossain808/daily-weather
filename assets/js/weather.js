
const apiResource = {
    weatherApi: " https://api.weatherapi.com/v1",
    weatherApiKey: "fea727a39dfa4c9897a54836241905",
    countryApi: "https://countriesnow.space/api/v0.1/countries"
}

const elements = {
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

}


const cityList = []

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
    const weatherData = await fetch(`${apiResource.weatherApi}/forecast.json?key=${apiResource.weatherApiKey}&q=${city}`)
    const data = await weatherData.json()
    return data
}
const updateWeatherPage = async (city = "dhaka") => {
    try {

        const { current, location, forecast } = await getCurrentWeather(city)
        const forecastData = forecast.forecastday[0]
        console.log(current, "current");
        console.log(location, "location");
        console.log(forecast, "forecast");
        document.body.style.backgroundImage = current.is_day ? "url('../../assets/images/day.jpg')" : "url('../../assets/images/night.jpg')"
        console.log(current.is_day);
        elements.tempField.innerText = current.temp_c + "°C"
        elements.conditionImg.src = `https://${current.condition.icon}`
        elements.conditionText.innerText = current.condition.text
        elements.countryName.innerText = location.country
        elements.fellField.innerText = current.feelslike_c + "°C"
        elements.cityName.innerText = location.name
        elements.chanceOfRaining.innerText = `${forecastData.day.daily_chance_of_rain}  % `
        elements.sunrise.innerText = forecastData.astro.sunrise
        elements.sunset.innerText = forecastData.astro.sunset
    } catch (error) {
        console.log(error);
    }

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
