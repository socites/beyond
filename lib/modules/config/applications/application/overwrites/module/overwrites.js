module.exports = function (config) {
    "use strict";

    let css, txt;
    Object.defineProperty(this, 'css', {
        'get': function () {
            return css;
        }
    });

    Object.defineProperty(this, 'txt', {
        'get': function () {
            return txt;
        }
    });

    if (typeof config.css === 'string') css = [config.css];
    else if (config.css instanceof Array) css = config.css;

    if (typeof config.txt === 'string') txt = [config.txt];
    else if (config.txt instanceof Array) txt = config.txt;

};
