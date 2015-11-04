var Properties = function (item, properties, specs, update) {
    "use strict";

    var timer;
    var values = {};

    for (var i in properties) {

        (function (self, prop) {

            values[prop] = specs[prop];
            Object.defineProperty(self, prop, {
                'get': function () {
                    return values[prop];
                }
            });

            Object.defineProperty(item, prop, {
                'get': function () {
                    return values[prop];
                },
                'set': function (value) {

                    values[prop] = value;

                    clearTimeout(timer);
                    timer = setTimeout(update, 100);

                }
            });

        })(this, properties[i]);

    }

};
