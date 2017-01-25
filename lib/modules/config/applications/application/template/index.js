require('colors');

module.exports = function (application, config) {
    "use strict";

    let async = require('async');

    config = (config) ? config : {};

    Object.defineProperty(this, 'application', {
        'get': function () {
            return config.application;
        }
    });

    Object.defineProperty(this, 'modules', {
        'get': function () {
            return config.modules;
        }
    });

    let overwrites;
    Object.defineProperty(this, 'overwrites', {
        'get': function () {
            return overwrites;
        }
    });

    let dirname;
    Object.defineProperty(this, 'dirname', {
        'get': function () {
            return dirname;
        }
    });

    let initialised;
    this.initialise = async(function *(resolve, reject) {

        if (initialised) {
            resolve();
            return;
        }
        initialised = true;

        if (typeof config === 'string') {

            config = yield require('./read.js')(application, config);
            if (!config) {
                resolve();
                return;
            }

            if (!config.path) dirname = config.dirname;
            else dirname = require('path').resolve(config.dirname, config.path);

        }
        else if (!config) {
            config = {};
        }
        else {

            if (typeof config !== 'object') {

                let message = 'Invalid template configuration on application "'.yellow +
                    (application.name).yellow.bold + '".'.yellow;

                console.log(message);
                config = {};

            }

            if (!config) config = {};

            if (!config.path) dirname = application.dirname;
            else dirname = require('path').resolve(application.dirname, config.path);

        }
        delete config.dirname;

        overwrites = new (require('./overwrites'))(application, dirname, config.overwrites);
        yield overwrites.initialise();

        resolve();

    });

    this.getCustomOverwrites = async(function *(resolve, reject, module, processor, error) {

        if (!overwrites || !overwrites.items[module.ID]) {
            resolve([]);
            return;
        }

        let moduleOverwrites = overwrites.items[module.ID];
        if (!moduleOverwrites.custom || !moduleOverwrites.custom[processor]) {
            resolve([]);
            return;
        }

        let dirname = moduleOverwrites.dirname;
        let files = moduleOverwrites.custom[processor];
        if (!(files instanceof Array) || !files.length) {
            resolve([]);
            return;
        }

        let Finder = require('finder');
        let finder = new Finder(dirname, {'list': files, 'usekey': 'relative.file'});
        try {
            yield finder.process();
        }
        catch (exc) {
            reject(error(exc));
        }

        files = [];
        for (let key in finder.items) {
            files.push(finder.items[key]);
        }

        resolve(files);

    });

};
