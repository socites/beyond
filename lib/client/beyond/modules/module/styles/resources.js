var Resources = function (module) {
    "use strict";

    var getResource = function (hostType, resource) {

        var host;
        var modulePath, filePath;

        if (resource.substr(0, 1) === '/') {
            resource = resource.substr(1);
        }

        if (hostType === 'module') {

            if (module.library) {
                host = beyond.hosts.libraries[module.library.name].js;
                library = module.library.name;
            }
            else {
                host = beyond.hosts.application.js;
                library = undefined;
            }

            modulePath = module.path;
            filePath = resource;

        }
        else if (hostType === 'application') {

            host = beyond.hosts.application.js;
            return host + resource;

        }
        else {

            var library = hostType;
            host = beyond.hosts.libraries[library];

            if (!host) {
                console.warn('invalid css host on module "' + module.ID + '", resource "' + resource + '"' +
                    ', library "' + library + '" is not defined');
                return;
            }

            if (resource.substr(0, 7) === 'static/') {
                modulePath = 'main';
                filePath = resource.substr(7);
            }
            else {
                var overwrite = resource.split('/static/');
                modulePath = overwrite[0];
                filePath = overwrite[1];
            }

        }

        var overwrites = beyond.overwrites;
        var overwrited;
        if (library) {
            overwrited = overwrites[library];
        }

        if (!overwrited || !overwrited[modulePath] ||
            overwrited[modulePath].indexOf(filePath) === -1) {

            return host + modulePath + '/static/' + filePath;
        }

        return beyond.hosts.application.js +
            'custom/' + library + '/' +
            modulePath + '/static/' + filePath;

    };

    var setHosts = function (styles) {

        // find variables
        var variable;

        var replace = {};

        var regexp = /#host\.(.*?)#(.*?)[\)\s]/g;
        variable = regexp.exec(styles);

        var resource;
        while (variable) {

            // hostType can be 'application', 'module', libraryName
            var hostType = variable[1];
            resource = variable[2];
            resource = getResource(hostType, resource);

            var original = variable[0];
            if (original.substr(original.length - 1) === ')')
                original = original.substr(0, original.length - 1);

            replace[original] = resource;
            variable = regexp.exec(styles);

        }

        // replace #host.* variables with their values
        for (var original in replace) {

            resource = replace[original];

            while (styles.indexOf(original) !== -1)
                styles = styles.replace(original, resource);

        }

        return styles;

    };

    this.process = function (styles) {

        // find and replace #host...
        styles = setHosts(styles);
        return styles;

    };

};
