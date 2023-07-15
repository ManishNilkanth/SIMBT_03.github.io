const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvindex = document.getElementById("uv-index"),
    uvtext = document.getElementById("uv-text"),
    windSpeed = document.getElementById("wind-speed"),
    sunRise = document.getElementById("sunrise"),
    sunSet = document.getElementById("sunset"),
    humidity = document.getElementById("humidity"),
    visibility = document.getElementById("visibility"),
    humidityStatus = document.getElementById("humidity-status"),
    airQuality = document.getElementById("air-quality"),
    airQualityStatus = document.getElementById("air-quality-status"),
    visibilityStatus = document.getElementById("visibility-status"),
    windStatus = document.getElementById("wind-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelector("#temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query"),
    body = document.getElementById("body");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";

//update date time
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        ampm = hour >= 12 ? "pm" : "am";    

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    //12 hour format
    hour = hour % 12;
    if(hour == 0)
    {
        hour = 12;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    let dayName = days[now.getDay()];
    return `${dayName} ,${hour}:${minute} ${ampm}`;
}

date.innerText = getDateTime();

//update time every second
setInterval(() => {
    date.innereText = getDateTime();
}, 1000);

//function to get public ip with fetch

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    }).then((response) => response.json())
        .then((data) => {
            
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        });
}

getPublicIp();

//function to get weather data

function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "2CUBHBTJC4H5Q8F8K2PVJBNNU";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            let today = data.currentConditions;
            if (unit == "c") {
                temp.innerText = today.temp;
            }
            else {

                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc- " + today.precip + "%";
            uvindex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvText(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            updateWindStatus(today.windspeed);
            sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            if(hourlyorWeek == "hourly")
            {   
              updateForecast(data.days[0].hours, unit,"day");  
            }
            else
            {   
                updateForecast(data.days, unit, "week");
            }
        })
        .catch((err) =>{
            alert("city is not present in database");
        })

}

//convert celcius to fahrenheit
function celciusToFahrenheit(temp) {
    console.log("this is tempreture:" + temp);
    return ((temp * 9) / 5 + 32).toFixed(1);
}

// function to get uv index status

function measureUvText(uvindex)
{
    if(uvindex <= 2)
    {
        uvtext.innerText = "Low";
    }
    else if(uvindex <=5)
    {
        uvtext.innerText = "Moderate";
    }
    else if(uvindex <=7)
    {
        uvtext.innerText = "High";
    }
    else if(uvindex <=10)
    {
        uvtext.innerText = "Very High";
    }
    else
    {
        uvtext.innerText = "extreme";
    }
}

function updateHumidityStatus(humidity)
{
    if(humidity <= 30)
    {
        humidityStatus.innerText = "Low";
    }
    else if(humidity <=5)
    {
        humidityStatus.innerText = "Moderate";
    }
    else
    {
        humidityStatus.innerText = "High";
    }
}

function updateVisibilityStatus(visibility)
{
   if(visibility <= 0.3)
   {
    visibilityStatus.innerText = "Dense Fog";
   } 
   else if(visibility <= 0.16)
   {
    visibilityStatus.innerText = "Moderate Fog";
   }
   else if(visibility <= 0.35)
   {
    visibilityStatus.innerText = "Light Fog";
   }
   else if(visibility <= 1.13)
   {
    visibilityStatus.innerText = "Very Light Fog";
   }
   else if(visibility <= 2.16)
   {
    visibilityStatus.innerText = "Light Mist";
   }
   else if(visibility <= 5.4)
   {
    visibilityStatus.innerText = "Very Light Mist";
   }
   else if(visibility <= 10.8)
   {
    visibilityStatus.innerText = "clear Air";
   }
   else 
   {
    visibilityStatus.innerText = "Very Clean Air";
   }

}

function updateAirQualityStatus(airQuality)
{
    if(airQuality <= 50)
    {
        airQualityStatus.innerText = "Good";
    }
    else if(airQuality <=100)
    {
        airQualityStatus.innerText = "Moderate";
    }
    else if(airQuality <= 150)
    {
        airQualityStatus.innerText = "Unhealthy of Sensitive Groups";
    }
    else if(airQuality <=200)
    {
        airQualityStatus.innerText = "Unhealthy";
    }
    else if(airQuality <= 250)
    {
        airQualityStatus.innerText = "Very Unhealthy";
    }
    else  
    {
        airQualityStatus.innerText = "Hazardous";
    }
}

function updateWindStatus(windSpeed)
{   if(windSpeed == 0)
    {
        windStatus.innerText = "Calm";
    }
    else if(windSpeed <= 3)
    {
        windStatus.innerText = "Light Air";
    }
    else if(windSpeed <=7)
    {
        windStatus.innerText = "Light Breeze"; 
    }
    else if(windSpeed <=12)
    {
        windStatus.innerText = "Gentle Breeze"; 
    }
    else if(windSpeed <=18)
    {
        windStatus.innerText = "Moderate Breeze"; 
    }
    else if(windSpeed <=24)
    {
        windStatus.innerText = "Fresh Breeze"; 
    }
    else if(windSpeed <=31)
    {
        windStatus.innerText = "Strong Breeze"; 
    }
    else if(windSpeed <=38)
    {
        windStatus.innerText = "Near Gale"; 
    }
    else  
    {
        windStatus.innerText = "Strong Wind"; 
    }
}

function convertTimeTo12HourFormat(time)
{
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";

    hour = hour % 12;
    hour = hour ? hour : 12;  
    hour = hour < 10 ? "0" + hour : hour;  

    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}
//update icons 
function getIcon(condition)
{
    if(condition == "Partly-cloudy-day")
    {   
        return "/icons/partly-cloudysun.png";
    }
    else if(condition == "Partly-cloudy-night")
    {    
        return "/icons/partily-cloudnight.png";
    }
    else if(condition == "rain")
    {    
        return "/icons/rain.png";
    }
    else if(condition == "clear-day")
    {    
        return "/icons/clearDay.png";
    }
    else if(condition == "clear-night")
    {    
        return "/icons/nightmoon.png" ;
    }
    else
    {    
        return "/icons/cloudySun.png" ;
    }
}

function getDayName(date)
{
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time)
{
    let hour = time.split(":")[0];
    let min = time.split(":")[1];

    if(hour > 12)
    {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    }
    else
    {
         return `${hour}:${min} AM`;  
    }

}
 
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
      numCards = 24;
    } else {
      numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      let dayName = getHour(data[day].datetime);
      if (type === "week") {
        dayName = getDayName(data[day].datetime);
      }
      let dayTemp = data[day].temp;
      if (unit === "f") {
        dayTemp = celciusToFahrenheit(data[day].temp);
      }
      let iconCondition = data[day].icon;
      let iconSrc = getIcon(iconCondition);
      let tempUnit = "°C";
      if (unit === "f") {
        tempUnit = "°F";
      }
      card.innerHTML = `
                  <h2 class="day-name">${dayName}</h2>
              <div class="card-icon">
                <img src="${iconSrc}" class="day-icon" alt="" />
              </div>
              <div class="day-temp">
                <h2 class="temp">${dayTemp}</h2>
                <span class="temp-unit">${tempUnit}</span>
              </div>
    `;
      weatherCards.appendChild(card);
      day++;
    }
  }
 function changeBackground(condition)
 {  
    let bg = "";
    if(condition == "Partly-cloudy-day")
    {   
        bg = "/images/cloudyDay.jpg";
    }
    else if(condition == "partly-clouly-night")
    {    
        bg = "/images/night.jpg";
    }
    else if(condition == "rain")
    {    
        bg = "/images/rainyCloud.jpg";
    }
    else if(condition == "clear-day")
    {    
        bg = "/images/SunnyDay.jpg";
    }
    else if(condition == "clear-night")
    {    
        bg = "/images/clearNight.jpg";
    }
    else
    {    
        bg = "/images/nature.jpg";
    } 
    body.style.backgroundImage = `url(${bg})`;
 }

fahrenheitBtn.addEventListener("click",()=>{
    changeUnit("f");
});

celciusBtn.addEventListener("click",()=>{
    changeUnit("c");
});

function changeUnit(unit){
     if(currentUnit != unit)
     {
        currentUnit = unit;
        
            // change unit on document
            tempUnit.innerText = `°${unit.toUpperCase()}`;
             

            if(unit == "c")
            {
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            }
            else
            {
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }

            // call get weather after change unit
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
         
     }
}

hourlyBtn.addEventListener("click",()=>{
    changeTimeSpan("hourly");
});

weekBtn.addEventListener("click",()=>{
    changeTimeSpan('week'); 
});

 
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
      hourlyorWeek = unit;
      if (unit === "hourly") {
        hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
      } else {
        hourlyBtn.classList.remove("active");
        weekBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
  }
 
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
      currentCity = location;
      getWeatherData(location, currentUnit, hourlyorWeek);
    }
  });
 
  var currentFocus;
  search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
      b,
      i,
      val = this.value;
    if (!val) {
      return false;
    }
    currentFocus = -1;
  
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");
  
    this.parentNode.appendChild(a);
  
    for (i = 0; i < cities.length; i++) {
      
      if (
        cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
      ) {
         
        b = document.createElement("li");
        //changes name to city
        b.innerHTML =
          "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
        b.innerHTML += cities[i].name.substr(val.length);
         
        b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
        
        b.addEventListener("click", function (e) {
           
          search.value = this.getElementsByTagName("input")[0].value;
          removeSuggestions();
        });
  
        a.appendChild(b);
      }
    }
  });
   
  search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
    
      currentFocus++;
     
      addActive(x);
    } else if (e.keyCode == 38) {
     
      currentFocus--;
      
      addActive(x);
    }
    if (e.keyCode == 13) {
      
      e.preventDefault();
      if (currentFocus > -1) {
        
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    
    if (!x) return false;
     
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;

    x[currentFocus].classList.add("active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
  }
  
  function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);
  }
  
  let cities =[
     
    {
      name: "Delhi", 
      lat: "28.6100", 
      lng: "77.2300", 
      country: "India", 
    }, 
    {
      name: "Mumbai", 
      lat: "19.0761", 
      lng: "72.8775", 
      country: "India", 
      
    }, 
    {
      name: "Kolkāta", 
      lat: "22.5675", 
      lng: "88.3700", 
      country: "India", 
       
    }, 
    {
      name: "Bangalore", 
      lat: "12.9789", 
      lng: "77.5917", 
      country: "India", 
       
    }, 
    {
      "name": "Chennai", 
      "lat": "13.0825", 
      "lng": "80.2750", 
      "country": "India", 
      
    }, 
    {
      "name": "Hyderābād", 
      "lat": "17.3850", 
      "lng": "78.4867", 
      "country": "India", 
       
    }, 
    {
      "name": "Pune", 
      "lat": "18.5203", 
      "lng": "73.8567", 
      "country": "India", 
       
    }, 
    {
      "name": "Ahmedabad", 
      "lat": "23.0300", 
      "lng": "72.5800", 
      "country": "India", 
      
    }, 
    {
      "name": "Sūrat", 
      "lat": "21.1702", 
      "lng": "72.8311", 
      "country": "India", 
       
    }, 
    {
      "name": "Prayagraj", 
      "lat": "25.4358", 
      "lng": "81.8464", 
      "country": "India", 
       
    }, 
    {
      "name": "Lucknow", 
      "lat": "26.8500", 
      "lng": "80.9500", 
      "country": "India", 
      
    }, 
    {
      "name": "Jaipur", 
      "lat": "26.9000", 
      "lng": "75.8000", 
      "country": "India", 
       
    }, 
    {
      "name": "Cawnpore", 
      "lat": "26.4499", 
      "lng": "80.3319", 
      "country": "India", 
       
    }, 
    {
      "name": "Mirzāpur", 
      "lat": "25.1460", 
      "lng": "82.5690", 
      "country": "India", 
       
    }, 
    {
      "name": "Nāgpur", 
      "lat": "21.1497", 
      "lng": "79.0806", 
      "country": "India", 
       
    }, 
    {
      "name": "Ghāziābād", 
      "lat": "28.6700", 
      "lng": "77.4200", 
      "country": "India", 
       
    }, 
    {
      "name": "Vadodara", 
      "lat": "22.3000", 
      "lng": "73.2000", 
      "country": "India", 
      
    }, 
    {
      "name": "Vishākhapatnam", 
      "lat": "17.7042", 
      "lng": "83.2978", 
      "country": "India", 
       
    }, 
    {
      "name": "Indore", 
      "lat": "22.7167", 
      "lng": "75.8472", 
      "country": "India", 
       
    }, 
    {
      "name": "Thāne", 
      "lat": "19.1972", 
      "lng": "72.9722", 
      "country": "India", 
       
    }, 
    {
      "name": "Bhopāl", 
      "lat": "23.2500", 
      "lng": "77.4167", 
      "country": "India", 
       
    }, 
    {
      "name": "Chinchvad", 
      "lat": "18.6186", 
      "lng": "73.8037", 
      "country": "India", 
       
    }, 
    {
      "name": "Patna", 
      "lat": "25.6000", 
      "lng": "85.1000", 
      "country": "India", 
       
    }, 
    {
      "name": "Bilāspur", 
      "lat": "22.0900", 
      "lng": "82.1500", 
      "country": "India", 
       
    }, 
    {
      "name": "Ludhiāna", 
      "lat": "30.9100", 
      "lng": "75.8500", 
      "country": "India", 
      
    }, 
    {
      "name": "Agwār", 
      "lat": "27.1800", 
      "lng": "78.0200", 
      "country": "India", 
       
    }, 
    {
      "name": "Āgra", 
      "lat": "27.1800", 
      "lng": "78.0200", 
      "country": "India", 
       
    }, 
    {
      "name": "Madurai", 
      "lat": "9.9252", 
      "lng": "78.1198", 
      "country": "India", 
       
    }, 
    {
      "name": "Jamshedpur", 
      "lat": "22.7925", 
      "lng": "86.1842", 
      "country": "India", 
      
    }, 
    {
      "name": "Nāsik", 
      "lat": "20.0000", 
      "lng": "73.7800", 
      "country": "India", 
      
    }, 
    {
      "name": "Farīdābād", 
      "lat": "28.4167", 
      "lng": "77.3000", 
      "country": "India", 
       
    }, 
    {
      "name": "Aurangābād", 
      "lat": "19.8800", 
      "lng": "75.3200", 
      "country": "India", 
       
    }, 
    {
      "name": "Rājkot", 
      "lat": "22.3000", 
      "lng": "70.7833", 
      "country": "India", 
       
    }, 
    {
      "name": "Meerut", 
      "lat": "28.9800", 
      "lng": "77.7100", 
      "country": "India", 
      
    }, 
    {
      "name": "Jabalpur", 
      "lat": "23.1667", 
      "lng": "79.9333", 
      "country": "India", 
       
    }, 
    {
      "name": "Kalamboli", 
      "lat": "19.2333", 
      "lng": "73.1333", 
      "country": "India", 
      
    }, 
    {
      "name": "Vasai", 
      "lat": "19.4700", 
      "lng": "72.8000", 
      "country": "India", 
       
    }, 
    {
      "name": "Najafgarh", 
      "lat": "28.6092", 
      "lng": "76.9798", 
      "country": "India", 
       
    }, 
    {
      "name": "Vārānasi", 
      "lat": "25.3189", 
      "lng": "83.0128", 
      "country": "India", 
       
    }, 
    {
      "name": "Srīnagar", 
      "lat": "34.0900", 
      "lng": "74.7900", 
      "country": "India", 
       
    }, 
    {
      "name": "Dhanbād", 
      "lat": "23.7998", 
      "lng": "86.4305", 
      "country": "India", 
       
    }, 
    {
      "name": "Amritsar", 
      "lat": "31.6400", 
      "lng": "74.8600", 
      "country": "India", 
      
    }, 
    {
      "name": "Alīgarh", 
      "lat": "27.8800", 
      "lng": "78.0800", 
      "country": "India", 
       
    }, 
    {
      "name": "Guwāhāti", 
      "lat": "26.1722", 
      "lng": "91.7458", 
      "country": "India", 
      
    }, 
    {
      "name": "Hāora", 
      "lat": "22.5800", 
      "lng": "88.3294", 
      "country": "India", 
      
    }, 
    {
      "name": "Rānchi", 
      "lat": "23.3600", 
      "lng": "85.3300", 
      "country": "India", 
      
    }, 
    {
      "name": "Gwalior", 
      "lat": "26.2215", 
      "lng": "78.1780", 
      "country": "India", 
      
    }, 
    {
      "name": "Chandīgarh", 
      "lat": "30.7500", 
      "lng": "76.7800", 
      "country": "India", 
       
    }, 
    {
      "name": "Vijayavāda", 
      "lat": "16.5193", 
      "lng": "80.6305", 
      "country": "India", 
       
    }, 
    {
      "name": "Jodhpur", 
      "lat": "26.2800", 
      "lng": "73.0200", 
      "country": "India", 
       
    }, 
    {
      "name": "Raipur", 
      "lat": "21.2500", 
      "lng": "81.6300", 
      "country": "India", 
       
    }, 
    {
      "name": "Kota", 
      "lat": "25.1800", 
      "lng": "75.8300", 
      "country": "India", 
       
    }, 
    {
      "name": "Kālkāji Devi", 
      "lat": "28.5485", 
      "lng": "77.2513", 
      "country": "India", 
       
    }, 
    {
      "name": "Bhayandar", 
      "lat": "19.2900", 
      "lng": "72.8500", 
      "country": "India", 
       
    }, 
    {
      "name": "Ambattūr", 
      "lat": "13.1143", 
      "lng": "80.1548", 
      "country": "India", 
       
    }, 
    {
      "name": "Salt Lake City", 
      "lat": "22.6100", 
      "lng": "88.4000", 
      "country": "India", 
      
    }, 
    {
      "name": "Bhātpāra", 
      "lat": "22.8700", 
      "lng": "88.4100", 
      "country": "India", 
       
    }, 
    {
      "name": "Kūkatpalli", 
      "lat": "17.4849", 
      "lng": "78.4138", 
      "country": "India", 
       
    }, 
    {
      "name": "Darbhanga", 
      "lat": "26.1700", 
      "lng": "85.9000", 
      "country": "India", 
       
    }, 
    {
      "name": "Dāsarhalli", 
      "lat": "13.0465", 
      "lng": "77.5130", 
      "country": "India", 
       
    }, 
    {
      "name": "Muzaffarpur", 
      "lat": "26.1225", 
      "lng": "85.3906", 
      "country": "India", 
       
    }, 
    {
      "name": "Oulgaret", 
      "lat": "11.9570", 
      "lng": "79.7737", 
      "country": "India", 
       
    }, 
    {
      "name": "New Delhi", 
      "lat": "28.6139", 
      "lng": "77.2090", 
      "country": "India", 
       
    }, 
    {
      "name": "Tiruvottiyūr", 
      "lat": "13.1600", 
      "lng": "80.3000", 
      "country": "India", 
       
    }, 
    {
      "name": "Puducherry", 
      "lat": "11.9167", 
      "lng": "79.8167", 
      "country": "India", 
       
    }, 
    {
      "name": "Byatarayanpur", 
      "lat": "13.0659", 
      "lng": "77.5922", 
      "country": "India", 
       
    }, 
    {
      "name": "Pallāvaram", 
      "lat": "12.9675", 
      "lng": "80.1491", 
      "country": "India", 
      
    }, 
    {
      "name": "Secunderābād", 
      "lat": "17.4399", 
      "lng": "78.4983", 
      "country": "India", 
       
    }, 
    {
      "name": "Shimla", 
      "lat": "31.1033", 
      "lng": "77.1722", 
      "country": "India", 
      
    }, 
    {
      "name": "Puri", 
      "lat": "19.8106", 
      "lng": "85.8314", 
      "country": "India", 
       
    }, 
    {
      "name": "Shrīrāmpur", 
      "lat": "22.7500", 
      "lng": "88.3400", 
      "country": "India", 
      
    }, 
    {
      "name": "Hugli", 
      "lat": "22.9089", 
      "lng": "88.3967", 
      "country": "India", 
      
    }, 
    {
      "name": "Chandannagar", 
      "lat": "22.8671", 
      "lng": "88.3674", 
      "country": "India", 
       
    }, 
    {
      "name": "Sultānpur Mazra", 
      "lat": "28.6981", 
      "lng": "77.0689", 
      "country": "India", 
       
    }, 
    {
      "name": "Krishnanagar", 
      "lat": "23.4000", 
      "lng": "88.5000", 
      "country": "India", 
       
    }, 
    {
      "name": "Bārākpur", 
      "lat": "22.7642", 
      "lng": "88.3776", 
      "country": "India", 
       
    }, 
    {
      "name": "Bhālswa Jahangirpur", 
      "lat": "28.7354", 
      "lng": "77.1638", 
      "country": "India", 
       
    }, 
    {
      "name": "Nāngloi Jāt", 
      "lat": "28.6833", 
      "lng": "77.0667", 
      "country": "India", 
       
    }, 
    {
      "name": "Yelahanka", 
      "lat": "13.1007", 
      "lng": "77.5963", 
      "country": "India", 
       
    }, 
    {
      "name": "Titāgarh", 
      "lat": "22.7400", 
      "lng": "88.3700", 
      "country": "India", 
       
    }, 
    {
      "name": "Dam Dam", 
      "lat": "22.6200", 
      "lng": "88.4200", 
      "country": "India", 
      
    }, 
    {
      "name": "Bānsbāria", 
      "lat": "22.9700", 
      "lng": "88.4000", 
      "country": "India", 
       
    }, 
    {
      "name": "Madhavaram", 
      "lat": "13.1482", 
      "lng": "80.2314", 
      "country": "India", 
      
    }, 
    {
      "name": "Baj Baj", 
      "lat": "22.4828", 
      "lng": "88.1818", 
      "country": "India", 
       
    }, 
    {
      "name": "Nerkunram", 
      "lat": "13.0667", 
      "lng": "80.2833", 
      "country": "India", 
       
    }, 
    {
      "name": "Kendrāparha", 
      "lat": "20.5000", 
      "lng": "86.4200", 
      "country": "India", 
       
    }, 
    {
      "name": "Sijua", 
      "lat": "23.7692", 
      "lng": "86.1673", 
      "country": "India", 
       
    }, 
    {
      "name": "Manali", 
      "lat": "13.1667", 
      "lng": "80.2667", 
      "country": "India", 
       
    }, 
    {
      "name": "Chakapara", 
      "lat": "22.6300", 
      "lng": "88.3500", 
      "country": "India", 
       
    }, 
    {
      "name": "Pāppākurichchi", 
      "lat": "10.8137", 
      "lng": "78.7481", 
      "country": "India", 
       
    }, 
    {
      "name": "Herohalli", 
      "lat": "12.9911", 
      "lng": "77.4873", 
      "country": "India", 
       
    }, 
    {
      "name": "Madipakkam", 
      "lat": "12.9623", 
      "lng": "80.1986", 
      "country": "India", 
       
    }, 
    {
      "name": "Sabalpur", 
      "lat": "25.6053", 
      "lng": "85.1835", 
      "country": "India", 
       
    }, 
    {
      "name": "Salua", 
      "lat": "22.6100", 
      "lng": "88.2700", 
      "country": "India", 
      
    }, 
    {
      "name": "Balasore", 
      "lat": "21.4942", 
      "lng": "86.9317", 
      "country": "India", 
       
    }, 
    {
      "name": "Jālhalli", 
      "lat": "13.0333", 
      "lng": "77.5500", 
      "country": "India", 
       
    }, 
    {
      "name": "Chinnasekkadu", 
      "lat": "13.1609", 
      "lng": "80.2573", 
      "country": "India", 
       
    }, 
    {
      "name": "Jethuli", 
      "lat": "25.5378", 
      "lng": "85.2841", 
      "country": "India", 
       
    }, 
    {
      "name": "Nagtala", 
      "lat": "22.3693", 
      "lng": "88.6071", 
      "country": "India", 
       
    }, 
    {
      "name": "Bāgalūr", 
      "lat": "13.1328", 
      "lng": "77.6685", 
      "country": "India", 
       
    }, 
    {
      "name": "Pakri", 
      "lat": "25.5876", 
      "lng": "85.1580", 
      "country": "India", 
       
    }, 
    {
      "name": "Hunasamaranhalli", 
      "lat": "13.1435", 
      "lng": "77.6200", 
      "country": "India", 
       
    }, 
    {
      "name": "Hesarghatta", 
      "lat": "13.1391", 
      "lng": "77.4783", 
      "country": "India", 
 
    }, 
    {
      "name": "Bommayapālaiyam", 
      "lat": "11.9922", 
      "lng": "79.8499", 
      "country": "India", 
      
    }, 
    {
      "name": "Gundūr", 
      "lat": "10.7339", 
      "lng": "78.7184", 
      "country": "India", 
       
    }, 
    {
      "name": "Punādih", 
      "lat": "25.5484", 
      "lng": "85.2649", 
      "country": "India", 
       
    }, 
    {
      "name": "Harilādih", 
      "lat": "23.6300", 
      "lng": "86.3500", 
      "country": "India", 
       
    },  
    {
      "name": "Mahuli", 
      "lat": "25.5430", 
      "lng": "85.2268", 
      "country": "India", 
       
    }, 
      
     
    
    {
      "name": "Devanandapur", 
      "lat": "22.9378", 
      "lng": "88.3698", 
      "country": "India", 
       
    }, 
    {
      "name": "Tribeni", 
      "lat": "23.0269", 
      "lng": "88.4565", 
      "country": "India", 
      
    }, 
    {
      "name": "Huttanhalli", 
      "lat": "13.1651", 
      "lng": "77.6512", 
      "country": "India", 
       
    }, 
    {
      "name": "Nathupur", 
      "lat": "25.5163", 
      "lng": "85.2544", 
      "country": "India", 
      
    }, 
    {
      "name": "Bāli", 
      "lat": "25.4810", 
      "lng": "85.2227", 
      "country": "India", 
      
    }, 
    {
      "name": "Vājarhalli", 
      "lat": "13.1022", 
      "lng": "77.4111", 
      "country": "India", 
      
    }, 
    {
      "name": "Saino", 
      "lat": "25.1134", 
      "lng": "87.0108", 
      "country": "India", 
      
    }, 
    {
      "name": "Shekhpura", 
      "lat": "25.5725", 
      "lng": "85.1428", 
      "country": "India", 
      
    }, 
    {
      "name": "Cāchohalli", 
      "lat": "13.0010", 
      "lng": "77.4717", 
      "country": "India", 
      
    }, 
    {
      "name": "Nārāyanpur Kola", 
      "lat": "25.1293", 
      "lng": "87.0076", 
      "country": "India", 
       
    }, 
    {
      "name": "Gyan Chak", 
      "lat": "25.5496", 
      "lng": "85.2423", 
      "country": "India", 
      
    }, 
    {
      "name": "Kasgatpur", 
      "lat": "13.1101", 
      "lng": "77.5045", 
      "country": "India", 
       
    }, 
    {
      "name": "Kitanelli", 
      "lat": "13.0095", 
      "lng": "77.4191", 
      "country": "India", 
       
    }, 
    {
      "name": "Harchandi", 
      "lat": "25.1000", 
      "lng": "87.0442", 
      "country": "India", 
       
    }, 
    {
      "name": "Santoshpur", 
      "lat": "22.4650", 
      "lng": "88.2193", 
      "country": "India", 
       
    }, 
    {
      "name": "Bendravādi", 
      "lat": "12.3636", 
      "lng": "76.9137", 
      "country": "India", 
       
    }, 
    {
      "name": "Kodagihalli", 
      "lat": "12.9771", 
      "lng": "77.4651", 
      "country": "India", 
       
    }, 
    {
      "name": "Harna Buzurg", 
      "lat": "25.0981", 
      "lng": "87.0148", 
      "country": "India", 
      
    }, 
    {
      "name": "Mailanhalli", 
      "lat": "13.1863", 
      "lng": "77.6963", 
      "country": "India", 
      
    }, 
    {
      "name": "Sultānpur", 
      "lat": "25.5248", 
      "lng": "85.2507", 
      "country": "India", 
      
    }
  ];



 
 