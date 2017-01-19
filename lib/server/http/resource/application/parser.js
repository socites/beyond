module.exports = function (url, modules, specs) {
    "use strict";

    let resource = url.split('/');
    url = url.split('/');

    let folder = url.shift();

    let languages = require('../languages.js');
    let application, language;
    if (folder === 'applications') {

        application = url.shift();
        resource.shift();
        resource.shift();

        folder = url.shift();
        if (folder === 'languages') {

            language = url.shift();
            resource.shift();
            resource.shift();

        }

    }
    else if (folder === 'languages') {

        language = url.shift();
        resource.shift();
        resource.shift();

    }

    resource = resource.join('/');

    if (!application) {
        application = specs.defaults.application;
    }
    if (!language) {
        language = specs.defaults.language;
    }

    let error;

    if (!application) {
        return {'error': 'Application not set.'};
    }

    if (!language || language.length !== 3 || languages.indexOf(language) === -1) {
        return {'error': 'Invalid language or language not set.'};
    }

    let applications = modules.applications;
    if (applications.keys.indexOf(application) === -1) {

        error = 'Application "' + application + '" does not exists or it is not properly configured.';
        return {'error': error};

    }

    return {
        'application': application,
        'language': language,
        'resource': resource
    };

};
