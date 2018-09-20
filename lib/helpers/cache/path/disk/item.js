module.exports = function (path, key, EMPTY) {
    'use strict';

    let async = require('async');
    let fs = require('fs');
    let fsco = require('co-fs');

    let file = require('path').join(path, key);

    let value;
    Object.defineProperty(this, 'value', {
        'get': function () {
            return value;
        }
    });

    let time;
    Object.defineProperty(this, 'time', {
        'get': function () {
            return time;
        }
    });

    let source = 'memory';
    Object.defineProperty(this, 'source', {
        'get': function () {
            return source;
        }
    });

    this.save = async(function* (resolve, reject, _value) {

        value = _value;
        time = Date.now();

        let type = typeof value;

        if (typeof value === 'object') _value = JSON.stringify(value);
        else _value = value.toString();

        let content;
        content = {
            'time': time,
            'type': type,
            'value': _value
        };

        fs.writeFile(file, JSON.stringify(content), () => null);
        resolve();

    });

    this.load = async(function* (resolve, reject) {

        if (!(yield fsco.exists(file))) {
            resolve();
            return;
        }

        let content = yield fsco.readFile(file, {'encoding': 'UTF8'});
        let item;

        try {

            item = JSON.parse(content);
            if (typeof item !== 'object') {

                fs.unlink(file);
                resolve();
                return;

            }

            if (item.type === 'object' && item.value) {

                try {
                    item.value = JSON.parse(item.value);
                }
                catch (exc) {
                    fs.unlink(file);
                    resolve();
                    return;
                }

            }
            else if (item.type === 'number') {

                try {
                    item.value = parseFloat(item.value);
                }
                catch (exc) {
                    fs.unlink(file);
                    resolve();
                    return;
                }

            }
            else if (item.type === 'undefined') {

                item.value = EMPTY;

            }

            time = item.time;
            value = item.value;
            source = 'disk';

            resolve();

        }
        catch (exc) {

            // remove invalid cache item
            fs.unlink(file);
            resolve();
            return;

        }

    });

    this.remove = async(function* (resolve, reject) {

        if ((yield fsco.exists(file))) {
            yield fsco.unlink(file);
        }

        resolve();

    });

};
