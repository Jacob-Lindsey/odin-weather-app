const city = document.getElementById('city');
const description = document.getElementById('description');
const title = document.querySelector('.title');
const temp = document.getElementById('temp');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feel');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const search = document.getElementById('location');
const searchInput = document.getElementById('location-input');
const unitToggle = document.getElementById('unit-toggle');
const loader = document.getElementById('loader');

const dataContainer = document.querySelector('.data');

let unitOfMeasurement = 'imperial'; // or metric
let unitSymbol = '\u00B0';

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

function clearData() {
    dataContainer.innerHTML = '';
}

function render(val) {
    let location = val;
    if (location && ( validateCity(location) || validateZip(location) )) {

        clearData();

        let url;

        if (validateCity(location)) {
            url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=b6b6ee9abc69bd562fb3a83c69ee7518&units=${unitOfMeasurement}`;
        } else if (validateZip(location)) {
            url = `http://api.openweathermap.org/data/2.5/forecast?zip=${location}&appid=b6b6ee9abc69bd562fb3a83c69ee7518&units=${unitOfMeasurement}`;
        }
        
        (async function() {
            loader.style.display = 'block';
            const data = await getData(url);
            loader.style.display = 'none';
            console.log(data);
            const forecastIndex = [0,8,16,24,32];

            title.textContent = data.city.name;

            forecastIndex.forEach((index) => {
                let card = document.createElement('div');
                let cardDate = document.createElement('div');
                let tempContainer = document.createElement('div');
                let tempLow = document.createElement('div');
                let tempHigh = document.createElement('div');
                let tempFeel = document.createElement('div');
                let tempIcon = document.createElement('img');
                let iconURL = `http://openweathermap.org/img/wn/${data.list[index].weather[0].icon}`+"@4x.png";
                let dateString = data.list[index].dt_txt; 
                tempIcon.src = iconURL;
                
                card.classList.add('card',`${unitOfMeasurement}`);
                cardDate.classList.add('card-date');
                tempContainer.classList.add('temp');
                tempLow.classList.add('temp-low');
                tempHigh.classList.add('temp-high');
                tempFeel.classList.add('temp-feel');
                tempIcon.classList.add('temp-icon');

                dateString = dateString.substring(0,dateString.length-9);
                dateString = dateString.substring(5,dateString.length);
                cardDate.textContent = dateString;
                tempLow.textContent = Math.round(data.list[index].main.temp_min) + unitSymbol;
                tempHigh.textContent = Math.round(data.list[index].main.temp_max) + unitSymbol;
                
                tempContainer.appendChild(tempIcon);
                tempContainer.appendChild(tempLow);
                tempContainer.appendChild(tempHigh);
                card.appendChild(cardDate);
                card.appendChild(tempContainer);

                dataContainer.appendChild(card);
            });
        })();

        searchInput.value = '';
    }
}

function validateCity(value) {
    return /^([a-zA-Z',.\s-]{2,49})$/.test(value);
}

function validateZip(value) {
    return /^\d{5}$|^\d{5}-\d{4}$/.test(value);
}

search.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('submit fired');
    render(searchInput.value);
});

unitToggle.addEventListener('click', function(e) {
    if (unitOfMeasurement === 'imperial') {
        unitOfMeasurement = 'metric';
        unitToggle.innerHTML = '&#8451;';
        unitToggle.style.backgroundColor = '#cf75eb';
    } else {
        unitOfMeasurement = 'imperial';
        unitToggle.innerHTML = '&#8457;';
        unitToggle.style.backgroundColor = '#6a9eec';
    }
    console.log('toggle fired');
    render(title.textContent);
});