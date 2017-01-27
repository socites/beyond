module.exports = function () {
    "use strict";

    this.exists = function (name) {

        for (let i in params) {

            if (i === name) {
                return true;
            }

        }

        return false;

    };

    let params = {};
    Object.defineProperty(this, 'stringified', {
        'get': function () {
            return JSON.stringify(params);
        }
    });

    Object.defineProperty(this, 'querystring', {
        'get': function () {

            let qs = require('querystring');
            let output = '?' + qs.stringify(params);

            if (output === '?') {
                output = '';
            }

            return output;

        }
    });


    this.set = function (name, value) {
        params[name] = value;
    };

    this.remove = function (name) {
        delete params[name];
    };

    this.map = function (map, input) {

        let errors = [];

        if (typeof input !== 'object') {
            input = {};
        }

        let output = {};

        for (let name in map) {

            if (!map[name]) {

                output[name] = '';
                continue;

            }
            else if (typeof map[name] === 'number' || typeof map[name] === 'string' || typeof map[name] === 'boolean') {

                output[name] = map[name];
                continue;

            }
            else {

                if (typeof map[name]['default'] !== 'undefined') {
                    // Set default value
                    output[name] = map[name]['default'];
                }

                let setSource = function (source) {

                    source = source.split('.');

                    if (source.length === 2 && source[0] === 'attributes') {
                        if (typeof input.attributes === 'object' &&
                            input.attributes !== null &&
                            typeof input.attributes[source[1]] !== 'undefined') {

                            // Set the output value with the corresponding input
                            // Default is overwritten if it exists
                            output[name] = input.attributes[source[1]];
                            return true;
                        }
                    }
                    else if (source.length === 2 && source[0] === 'session') {
                        if (typeof input.session === 'object' &&
                            input.session !== null &&
                            typeof input.session[source[1]] !== 'undefined') {

                            // Set the output value with the corresponding input
                            // Default is overwritten if it exists
                            output[name] = input.session[source[1]];
                            return true;
                        }
                    }
                    else if (source.length === 2 && source[0] === 'document') {
                        if (typeof input.document === 'object' &&
                            input.document !== null &&
                            typeof input.document[source[1]] !== 'undefined') {

                            // Set the output value with the corresponding input
                            // Default is overwritten if it exists
                            output[name] = input.document[source[1]];
                            return true;
                        }
                    }
                    else if (source.length === 2 && source[0] === 'picture') {
                        if (typeof input.picture === 'object' &&
                            input.picture !== null &&
                            typeof input.picture[source[1]] !== 'undefined') {

                            // Set the output value with the corresponding input
                            // Default is overwritten if it exists
                            output[name] = input.picture[source[1]];
                            return true;
                        }
                    }
                    else if (source.length === 1 && typeof input[source[0]] !== 'undefined') {
                        // Set the output value with the corresponding input
                        // Default is overwritten if it exists
                        output[name] = input[source[0]];
                        return true;
                    }

                    return false;

                };

                if (typeof map[name].source === 'string' &&
                    typeof input === 'object' &&
                    input !== null) {

                    // Set the output value with the corresponding input
                    // Default is overwritten if it exists
                    setSource(map[name].source);
                }

                if (typeof map[name].source === 'object' &&
                    typeof input === 'object' &&
                    input !== null) {

                    for (let i in map[name].source) {
                        if (setSource(map[name].source[i])) break;
                    }
                }

            }

            // Check for required parameters
            if (typeof map[name].required === 'boolean' &&
                map[name].required && (!output[name] || !output[name])) {

                let error = 'parameter "' + name + '" is required';
                errors.push(error);

            }

            // Check if the parameter meets the list of allowed values
            if (typeof map[name].allowed === 'object' &&
                map[name].allowed.indexOf(output[name]) === -1) {

                let error = 'the value "' + output[name] +
                    '" is not allowed for the parameter "' + name + '"';
                errors.push(error);

            }

        }

        if (errors.length) {
            return errors;
        }

        for (let i in output) {
            params[i] = output[i];
        }

    };

};
