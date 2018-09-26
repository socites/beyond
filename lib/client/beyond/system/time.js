/*
 * Returns a string with the corresponding formatted time
 * @param int $timestamp timestamp to be parsed
 * @return string
 */
window.friendlyTime = function (timestamp, specs) {
    'use strict';

    if (!timestamp) return '';

    if (!specs) specs = {};

    let fullDate = new Date(timestamp * 1000);
    let months = [
        'Ene', 'Feb', 'Mar',
        'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep',
        'Oct', 'Nov', 'Dic'];

    let dateObject = {
        'seconds': fullDate.getSeconds(),
        'minutes': fullDate.getMinutes(),
        'hours': fullDate.getHours(),
        'day': fullDate.getUTCDate(),
        'month': months[fullDate.getMonth()],
        'year': fullDate.getFullYear()
    };

    let currentDate = new Date();
    currentDate = {
        'seconds': currentDate.getSeconds(),
        'minutes': currentDate.getMinutes(),
        'hours': currentDate.getHours(),
        'day': currentDate.getUTCDate(),
        'month': months[currentDate.getMonth()],
        'year': currentDate.getFullYear()
    };

    // Hour and minutes for same day
    let minutes = dateObject.minutes.toString();
    minutes = (minutes.length === 1) ? minutes = `0${minutes}` : minutes;

    let text = `${dateObject.hours}:${minutes}`;

    // Day and month (textual) for diff day/month from same year
    if (dateObject.year === currentDate.year &&
        (dateObject.day !== currentDate.day || dateObject.month !== currentDate.month)) {

        text = dateObject.day + ' ' + dateObject.month + ((specs.forceHour) ? ', ' + text : ' ');

    }

    // Day, month and year for older years
    if (dateObject.year !== currentDate.year) {
        text = `${dateObject.day} ${dateObject.month} ${dateObject.year}`;
    }

    return text;

};
