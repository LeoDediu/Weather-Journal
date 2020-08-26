/* Global Variables */
const api_key_weather = '716a1ee5594a1d55229a74d5a23b46a4';
const link = 'http://api.openweathermap.org/data/2.5/weather?zip=';
//api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
const gen_button = document.getElementById('generate');
const zip_input = document.getElementById('zip');
const feel_input = document.getElementById('feelings');

const date_out_div = document.getElementById('date');
const temp_out_div = document.getElementById('temp');
const location_out_div = document.getElementById('location');
const humid_out_div = document.getElementById('humid');
const feel_out_div = document.getElementById('content');
const zip_error = document.getElementById('zip_error');
const data_list = document.getElementById('data_list');

// Events
gen_button.addEventListener('click', generator);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

//Functions

//Regex zip validator
function isZipValid(sZip) {
    return /^\d{5}(-\d{4})?$/.test(sZip);
}

//Get weather data from OpenWeatherMap.com
const getWeather = async(zip) => {
    const res = await fetch(link + zip + '&appid=' + api_key_weather);
    try {
        const data = await res.json();
        //console.log(data)
        return data;
    }  
    catch(error) {
        console.log("Something went wrong fetching weather info", error);
        return error;
    }
}

//Post data to the server
const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await response.json();
        return newData;
    } 
    catch (error) {
        console.log("Couldn't update the data", error);
    }
};

//Creating one object instead of 5 variables to send to the server
const createObj = (obj) => {
    let res = {};
    res.feeling = (feel_input.value == "") ? "I'm not talkative today" : feel_input.value;
    res.temp = parseInt(9 / 5 * (obj.main.temp - 273) + 32) + '\xB0F';
    res.humid = obj.main.humidity + '%';
    res.town = obj.name;
    res.timeNow = newDate;
    //console.log(newDate);
    return res;
}

//Updating UI content of the page, first half - updating last input, second half - history of last 5 inputs
const updateUI = async() => {
    const request = await fetch('/get');
    try {
        const arrData = await request.json();
        //console.log(arrData);
        date_out_div.innerHTML = 'Date: ' + arrData[0].timeNow;
        location_out_div.innerHTML = 'Location: ' + arrData[0].town;
        temp_out_div.innerHTML = 'Temperature: ' + arrData[0].temp;
        humid_out_div.innerHTML = 'Humidity: ' + arrData[0].humid;
        feel_out_div.innerHTML = 'My feelings today: ' + arrData[0].feeling;
        //history
        data_list.innerHTML = "";
        let iter = Math.min(arrData.length, 5);
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < iter; i++)
        {
            const newElement = document.createElement('li');
            newElement.innerHTML = `<div class="hist_fin_data">
                                        <div>${arrData[i].timeNow}</div>
                                        <div>${arrData[i].town}</div>
                                        <div>${arrData[i].temp}</div>
                                        <div>${arrData[i].humid}</div>
                                        <div>${arrData[i].feeling}</div>
                                    </div>`
            fragment.appendChild(newElement);
        }
        data_list.appendChild(fragment);
    } catch (error) {
        console.log("Error", error);
    }
}

//Main function, check for valid zip -> get data from api -> send data to server -> update UI
async function generator() {
    const zip = zip_input.value;
    zip_error.style.visibility = "hidden";
    if (!isZipValid(zip))
    {
        zip_error.style.visibility = "visible";
        return;
    }
    gen_button.textContent = 'Loading...'
    const weather_data = await getWeather(zip); 
    gen_button.textContent = 'Generate';
    if (weather_data.cod == 404)
    {
        zip_error.style.visibility = "visible";
        return;
    }
    let obj = createObj(weather_data);
    //console.log(obj)
    await postData('/addData', obj);
    await updateUI();
}
