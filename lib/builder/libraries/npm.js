module.exports = require('async')(function *(resolve, reject, library, path) {
    "use strict";

    let fs = require('co-fs');
    let save = require('../fs/save');
    let copy = require('../fs/copy');

    let sources = {};
    let resources = {};

    if (typeof library.npm.publish === 'string') {

        sources.publish = require('path').join(library.dirname, library.npm.publish);
        if (!(yield fs.exists(sources.publish))) {
            console.log('NPM Publish script not found on library "'.red + (library.name).bold.red + '"'.red);
            delete sources.publish;
        }

    }

    sources.package = require('path').join(library.dirname, library.npm.package);
    if (!(yield fs.exists(sources.package))) {
        console.log('NPM Package does not exist on library "'.red + (library.name).bold.red + '"'.red);
        resolve();
        return;
    }

    try {
        resources.package = require(sources.package);
    }
    catch (exc) {
        console.log('Error opening npm package on library "'.red + (library.name).bold.red + '"'.red);
        console.log(exc.error);
        resolve();
        return;
    }

    sources.version = require('path').join(library.dirname, library.npm.version);
    if (!(yield fs.exists(sources.version))) {
        console.log('NPM Version does not exist on library "'.red + (library.name).bold.red + '"'.red);
        resolve();
        return;
    }

    try {
        resources.version = require(sources.version);
    }
    catch (exc) {
        console.log('Error opening npm version on library "'.red + (library.name).bold.red + '"'.red);
        console.log(exc.error);
        resolve();
        return;
    }

    let version = resources.version;
    if (typeof version !== 'object' || typeof version.version !== 'string') {
        console.log('Invalid npm version on library "'.red + (library.name).bold.red + '"'.red);
        resolve();
        return;
    }

    version = version.version;
    version = version.split('.');

    let minor = version.pop();
    minor = parseInt(minor) + 1;
    version.push(minor);
    version = version.join('.');

    resources.package.version = version;

    // Save the package.json file
    let target = require('path').join(library.build.js, 'package.json');
    yield save(target, JSON.stringify(resources.package));

    // Update version
    yield save(sources.version, JSON.stringify({
        'version': version
    }));

    // Save the publish script
    if (sources.publish) {

        target = require('path').join(library.build.js, 'publish.js');
        console.log(sources.publish, target);
        yield copy.file(sources.publish, target);

    }

    resolve();

});
