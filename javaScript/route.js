'use strict';
import { upadateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=30.316496&lon=78.032188";


const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;
        upadateWeather(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
    });
}


/**
 * 
 * @param {string} query searched query 
 */
const searchedLocation = query => upadateWeather(...query.split("&"));



const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    }
    else {
        checkHash();
    }
});
