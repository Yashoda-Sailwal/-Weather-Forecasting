"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * add event listener on multiple element
 * @param {NodeList} elements
 * @param {string} eventType
 * @param {Function} callback
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) {
    element.addEventListener(eventType, callback);
  }
};

// toggle search in mobile devices

const serchView = document.querySelector("[data-search-view]");

const searchToggelers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => serchView.classList.toggle("active");

addEventOnElements(searchToggelers, "click", toggleSearch);

/**
 * search integation with api
 */

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchField.classList.add("active");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
                <ul class="view-list" data-search-list></ul>`;

        const items = [];
        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");
          searchItem.innerHTML = `
                <span class="material-symbols-outlined">Location_On</span>
                    <div>
                        <p class="item-title">${name}</p>
                        <p class="label-2 item-substitute">${
                          state || ""
                        } ${country}</p>
                    </div>

                    <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name}  weather" data-search-toggler></a>
                `;

          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);

          items.push(searchItem.querySelector("[data-search-toggler]"));
        }
        addEventOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");

const loading = document.querySelector("[data-loading]");

const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);

const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html
 * @param {number} lat
 * @param {number} lon
 */
export const upadateWeather = function (lat, lon) {
  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );

  const bodyBackgroundImage = document.querySelector("[data-weather-image]");

  const highlightSection = document.querySelector("[data-highlights]");

  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /**  current weather section   */

  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;

    const [{ main, description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = ` 
            <h2 class="title-2 card-title">NOW
            </h2>
            <div class="weapper">
                <p class="heading">${parseInt(temp)}&deg C</p>
                <img src="./Material/${icon}.png" alt="ocercast Clouds" width="54px" height="54px" class="weather-icon">
            </div>

            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="material-symbols-outlined">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(
                      dateUnix,
                      timezone
                    )}</p>
                </li>
                <li class="meta-item">
                    <span class="material-symbols-outlined">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        `;

    // add image to background

    let oldImage = bodyBackgroundImage.classList[1];
    bodyBackgroundImage.classList.replace(oldImage, `${main}`);

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name} , ${country}`;
    });

    currentWeatherSection.appendChild(card);

    /**  Today highlight */

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { so2, o3, no2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
          <h2 class="title-2">Today Highlights</h2>

                    <div class="highlight-list">

                        <div class="card card-sm highlight-card one">
                            <h3 class="title-3">Air Quality Index</h3>

                            <div class="wrapper">

                              <span class="material-symbols-outlined">air</span>
                                <ul class="card-list">

                                    <li class="card-item">
                                        <p class="title-1">${pm2_5.toPrecision(
                                          3
                                        )}</p>
                                        <p class="label-1">PM <sub>2.5</sub></p>
                                    </li>

                                    <li class="card-item">
                                        <p class="title-1">${so2.toPrecision(
                                          3
                                        )}</p>

                                        <p class="label-1">SO <sub>2</sub></p>
                                    </li>

                                    <li class="card-item">
                                        <p class="title-1">${no2.toPrecision(
                                          3
                                        )}</p>

                                        <p class="label-1">NO<sub>2</sub></p>
                                    </li>

                                    <li class="card-item">
                                        <p class="title-1">${o3.toPrecision(
                                          3
                                        )}</p>

                                        <p class="label-1">O<sub>3</sub></p>
                                    </li>
                                </ul>
                            </div>

                            <span class="badge aqi-${aqi} label-${aqi}" title="${
        module.aqiText[aqi].message
      }">
                                ${module.aqiText[aqi].level}
                            </span>

                        </div>


                        <div class="card card-sm highlight-card two">

                            <h3 class="title-3">Sunrise & Sunset</h3>

                            <div class="card-list">

                                <div class="card-item">
                                <span class="material-symbols-outlined">clear_day</span>

                                    <div>
                                        <p class="label-1">
                                            Sunrise
                                        </p>
                                        <p class="title-1">${module.getTime(
                                          sunriseUnixUTC,
                                          timezone
                                        )}</p>
                                    </div>
                                </div>
                                <div class="card-item">
                                <span class="material-symbols-outlined">clear_night</span>

                                    <div>
                                        <p class="label-1">
                                            Sunset
                                        </p>
                                        <p class="title-1">${module.getTime(
                                          sunsetUnixUTC,
                                          timezone
                                        )}</p>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div class="card card-sm highlight-card">

                            <h3 class="title-3">Humidity</h3>
                            <div class="wrapper">
                                <span class="material-symbols-outlined">humidity_low</span>
                                <p class="title-1">${humidity}%</p>
                            </div>
                        </div>


                        <div class="card card-sm highlight-card">

                            <h3 class="title-3">Pressure</h3>
                            <div class="wrapper">
                               <span class="material-symbols-outlined">airwave</span>
                                <p class="title-1">${pressure}<small>hpa</small></p>
                            </div>
                        </div>


                        <div class="card card-sm highlight-card">

                            <h3 class="title-3">Visibility</h3>
                            <div class="wrapper">
                               <span class="material-symbols-outlined">visibility</span>
                                <p class="title-1">${
                                  visibility / 1000
                                } <small>Km</small></p>
                            </div>
                        </div>


                        <div class="card card-sm highlight-card">

                            <h3 class="title-3">Feel Like</h3>
                            <div class="wrapper">
                                <span class="material-symbols-outlined">thermostat</span>
                                <p class="title-1">${parseInt(
                                  feels_like
                                )}&deg;C</p>
                            </div>
                        </div>
                    </div>
          `;

      highlightSection.appendChild(card);
    });

    /**
     *  24 Forecast Section
     */

    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
            <h2 class="title-2">Today At</h2>

            <div class="slider-container">
              <ul class="slider-list" data-temp>
                  
              </ul>

              <ul class="slider-list" data-wind>
                                   
              </ul>
            </div>
          `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;

        const [{ icon, description }] = weather;

        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");
        tempLi.innerHTML = `
                <div class="card card-sm slider-card">

                    <p class="body-3">${module.getHours(
                      dateTimeUnix,
                      timezone
                    )}</p>

                    <img src="./Material/${icon}.png" width="48px" height="48px" loading="lazy" alt="${description}" class="weather-icon" title="${description}">

                    <p class="body-3">${parseInt(temp)}&deg;</p>
                </div>
            `;

        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");
        windLi.innerHTML = `
              <div class="card card-sm slider-card">

                <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

                <img src="./Material/direction.png" width="48px" height="48px" loading="lazy" alt="" class="weather-icon" style="transform:rotate(${
                  windDirection - 180
                }deg)">

                <p class="body-3">${parseInt(
                  module.mps_to_kmh(windSpeed)
                )}km/h</p>

              </div>
            `;

        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      /**``````````````` 5 -day forecast section ``````````````````` */

      forecastSection.innerHTML = `
      <div class="card card-lg forecast-card">
      <h2 class="title-2">5 Day Forecast</h2>
              <ul data-forecast-list>

                  <li class="card-item">
                      
                  </li>

              </ul>
          </div>
        `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];

        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");

        li.innerHTML = `
            <div class="icon-wrapper">
                <img src="./Material/${icon}.png" alt="${description}" width="36px" height="36px" class="weather-icon" title="${description}">

                <span class="span">
                    <p class="title-2">${parseInt(temp_max)}&deg;C</p>
                </span>
            </div>

            <p class="label-1">${date.getDate()} ${
          module.monthNames[date.getUTCMonth()]
        }</p>
            <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
          `;

        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });
  });
};

/**``````````````````````````  calling weather news api `````````````````````*/

const weatherNewsBox = document.querySelector("[weather-news]");

weatherNewsBox.innerHTML = `<h2 class="title-2">Top Weather News</h2>`

fetchData(url.weatherNews(), function (weatherData) {
  const { articles } = weatherData;

  const newsList = document.createElement("div");
  newsList.classList.add("newsList", "card", "card-lg");

  for (let i = 0; i < 10; i++) {
    const { title, description, url, image } = articles[i];

    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
              <div class="image-box">
                  <img src="${image}" alt="Image" width="200px" height="200px" loading="lazy">
              </div>
              <div class="news-summary">
                  <a href="${url}" class="label-1" title="${title}">${description}</a>
              </div>
        `;

    newsList.appendChild(newsItem);
  }
  weatherNewsBox.appendChild(newsList);
});

export const error404 = () => (errorContent.style.display = "flex");



// light- dark mode script 

var lightMode=document.querySelector(".light-dark-mode");
lightMode.addEventListener("click",()=>{
  var btn=document.querySelector("#light-mode");
  if(btn.checked==true){
    document.querySelector(".light-icon").innerText="dark_mode";
    module.lightMode();
  }
  else{
    document.querySelector(".light-icon").innerText="light_mode";
    module.darkMode();
  }
});
