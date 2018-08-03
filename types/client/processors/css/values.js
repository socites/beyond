let Values = function (module) {

    // Find a css value
    let retrieve = function (value) {

        let process = value.split('-');
        value = (beyond.config.css) ? beyond.config.css.values : {};
        for (let i in process) {

            if (!process.hasOwnProperty(i)) continue;
            value = value[process[i]];
            if (typeof value === 'undefined') return;

        }

        return value;

    };

    this.process = function (styles) {

        let regexp = /value\((.*?)\)/g;
        let value = regexp.exec(styles);

        let replace = {};

        while (value) {

            let retrieved = retrieve(value[1]);

            if (typeof retrieved === 'string') {
                replace[value[0]] = retrieved;
            }
            else {
                console.warn(`Invalid css value "${value[1]}" value`, retrieved)
            }

            value = regexp.exec(styles);

        }

        // replace all values with their values
        for (let name in replace) {

            let value = replace[name];
            while (styles.indexOf(name) !== -1) {
                styles = styles.replace(name, value);
            }

        }

        return styles;

    };

};
