module.exports = function () {
    "use strict";

    // Saves the state of the screens
    let screens = new Map();
    Object.defineProperty(this, 'screens', {
        'get': function () {
            return screens;
        }
    });

    this.update = function () {

    };

};
