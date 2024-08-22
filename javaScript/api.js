'use strict';
const api_key="46856b024a23a0bcfcf98c5194d9945e";
const news_api_key="35ba6335de7692bf0b2a1d4b41e163e3";

/**
 * fetch data from server
 * 
 * @param {string} URL API url
 * @param {Function} callback callback
 */

export const fetchData=function(URL,callback){
    fetch(URL)
    .then(res=>res.json())
    .then(data=>callback(data));
};

export const url={
    currentWeather(lat,lon){
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&appid=${api_key}`;
    },
    forecast(lat,lon){
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric&appid=${api_key}`;
    },
    airPollution(lat,lon){
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}&appid=${api_key}`;
    },
    reverseGeo(lat,lon){
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5&appid=${api_key}`;
    },

    /**
     * 
     * @param {string} query  search query eg.'delhi' ,'dehradun' 
     */
    geo(query){
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${api_key}`;
    },

    /** weather news api request function */

    /**
     * 
     * @param {Number} dateFrom 
     * @param {Number} dateTo 
     */
    weatherNews(){
        return `https://gnews.io/api/v4/search?q="weather forecast" OR rain&country=in&apikey=${news_api_key}`;
    }

}