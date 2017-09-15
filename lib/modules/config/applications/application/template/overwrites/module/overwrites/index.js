module.exports = function (config) {
    "use strict";

    let less, css, txt;
    Object.defineProperty(this, 'less', {
        'get': function () {
            return less;
        }
    });

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

    if (typeof config.less === 'string') less = [config.less];
    else if (config.less instanceof Array) less = config.less;

    if (typeof config.css === 'string') css = [config.css];
    else if (config.css instanceof Array) css = config.css;

    if (typeof config.txt === 'string') txt = [config.txt];
    else if (config.txt instanceof Array) txt = config.txt;

};
