'use strict';

export const weekDayNames=[
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const monthNames=[
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

/**
 * 
 * @param {number} dateUnix  unix date in second
 * @param {number} timezone  timezone 
 * @returns {string} date string.
 */
export const getDate=function(dateUnix,timezone){
    const date =new Date((dateUnix+timezone)*1000);
    
    const weekDayName=weekDayNames[date.getUTCDay()];

    const monthName =monthNames[date.getUTCMonth()];

    return `${weekDayName} ${date.getUTCDate()} ${monthName}`;
}

/**
 * 
 * @param {number} timeUnix  unix date in second
 * @param {number} timezone timezone 
 * @returns {string} time string
 */

export const getTime=function(timeUnix,timezone){
    const date =new Date((timeUnix+timezone)*1000);
    const hours=date.getUTCHours();
    const minutes=date.getUTCMinutes();
    const period=hours >= 12 ? "PM" :"AM";

    return `${hours %12 || 12} : ${minutes} ${period}`;
}



/**
 * 
 * @param {number} timeUnix  unix date in second
 * @param {number} timezone timezone 
 * @returns {string} time string
 */

export const getHours=function(timeUnix,timezone){
    const date =new Date((timeUnix+timezone)*1000);
    const hours=date.getUTCHours();
    const period=hours >= 12 ? "PM" :"AM";

    return `${hours %12 || 12} ${period}`;
}


/**
 * 
 * @param {number} mps  metter per seconds 
 * @returns {string} kilometer per hours
 */
export const mps_to_kmh= mps => {
    const mph =mps*3600;
    return mph/1000;
}

export const aqiText={
    1:{
        level:"Good",
        message:"Air quality is considered satisfactory and air pollution poses little or no risk"
    },
    2:{
        level:"Fair",
        message:"Air quality is acceptable"
    },
    3:{
        level:"Moderate",
        message:"Member of sensitive group may experience health effects."
    },
    4:{
        level:"Poor",
        message:"Air quality is considered satisfactory and air pollution poses little or no risk"
    },
    5:{
        level:"Very Poor",
        message:"Air quality is considered satisfactory and air pollution poses little or no risk"
    },
}


// functio for change the color of website on light mode

export const lightMode=function(){
    
    document.documentElement.style.setProperty("--secondry","#a9ceff");
    document.documentElement.style.setProperty("--header","#ffffff");
    document.documentElement.style.setProperty("--surface","#ffffff");
    document.documentElement.style.setProperty("--on-surface","#131214");
    document.documentElement.style.setProperty("--search","#131214");
    document.documentElement.style.setProperty("--on-surface-variant","#131214");
    document.documentElement.style.setProperty("--on-surface-variant-2","#dfdfdf");
    
}

export const darkMode=function(){
    document.documentElement.style.removeProperty("--secondry");   
    document.documentElement.style.removeProperty("--header");   
    document.documentElement.style.removeProperty("--surface");   
    document.documentElement.style.removeProperty("--on-surface");   
    document.documentElement.style.removeProperty("--on-surface-variant-2");   
    document.documentElement.style.removeProperty("--on-surface-variant");   
    document.documentElement.style.removeProperty("--search");   
}