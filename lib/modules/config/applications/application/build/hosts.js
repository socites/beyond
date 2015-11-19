module.exports = function (application, config, specs) {
    "use strict";

    if (typeof config === 'string') {
        config = {
            'production': config,
            'development': config
        };
    }

    if (typeof config !== 'object') {
        console.log('invalid hosts specification on application "'.red + (application.name).bold.red + '"'.red)
        return;
    }

    let hosts = config[specs.environment];
    if (typeof hosts === 'string') hosts = {
        'js': hosts,
        'ws': hosts
    };

    if (typeof hosts !== 'object' ||
        typeof hosts.js !== 'string' ||
        (application.connect && typeof hosts.ws !== 'string')) {

        console.log('invalid build hosts "'.red + (specs.environment).bold.red + '" on application "'.red + (application.name).bold.red + '"'.red)
        return;

    }

    return hosts;

};
