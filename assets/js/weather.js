
const apiResource = {
    weatherApi: " https://api.weatherapi.com/v1",
    weatherApiKey: "fea727a39dfa4c9897a54836241905",
    countryApi: "https://countriesnow.space/api/v0.1/countries"
}

const elements = {
    inputField: document.querySelector(".inputField"),
    tempField: document.querySelector(".temp"),
    conditionImg: document.querySelector(".conditionImg"),
    conditionText: document.querySelector(".conditionText"),
    searchBtn: document.querySelector(".searchBtn"),
    selectOption: document.querySelector(".selectOption")

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

const getCurrentWeather = async (city = "dhaka") => {
    try {
        const weatherData = await fetch(`${apiResource.weatherApi}/current.json?key=${apiResource.weatherApiKey}&q=${city}`)
        const data = await weatherData.json()
        console.log(data);
        elements.tempField.innerText = data.current.temp_c
        elements.conditionImg.src = `https://${data.current.condition.icon}`
        elements.conditionText.innerText = data.current.condition.text
    } catch (error) {
        console.log(error);
    }

}
getCurrentWeather()




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
            // console.log(element);
            li.textContent = element
            li.value = element
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
    getCurrentWeather(inputValue)



    elements.inputField.value = ''
})













