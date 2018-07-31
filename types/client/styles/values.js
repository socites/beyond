var Values = function (module) {
    "use strict";

    // find a css value
    var retrieve = function (value) {

        var process = value.split('-');
        value = beyond.css.values;
        for (var i in process) {

            value = value[process[i]];
            if (typeof value === 'undefined') return;

        }

        return value;

    };

    this.process = function (styles) {

        var regexp = /value\((.*?)\)/g, styles;
        var value = regexp.exec(styles);

        var replace = {};

        while (value) {

            var retrieved = retrieve(value[1]);

            if (typeof retrieved !== 'string') {

                console.warn(
                    'invalid css value "' + value[1] +
                    '" value, it must be an string and it is ' + typeof retrieved)

            }
            else replace[value[0]] = retrieved;

            value = regexp.exec(styles);

        }

        // replace all values with their values
        for (var name in replace) {

            var value = replace[name];
            while (styles.indexOf(name) !== -1) {
                styles = styles.replace(name, value);
            }

        }

        return styles;

    };

};
