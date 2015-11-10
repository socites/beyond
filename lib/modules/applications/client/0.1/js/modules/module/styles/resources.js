var Resources = function (module) {
    "use strict";

    var getResource = function (library, resource) {

        var host = beyond.hosts.libraries[library];
        if (!host) {
            console.warn('invalid css host on module "' + module.ID + '", resource "' + resource + '"' +
                ', library "' + library + '" is not defined');
            return;
        }

        var module, path;
        if (resource.substr(0, 7) === 'static/') {
            module = 'main';
            path = resource.substr(7);
        }
        else {
            var overwrite = resource.split('/static/');
            module = overwrite[0];
            path = overwrite[1];
        }

        var overwrites = beyond.overwrites;
        var overwrited = overwrites[library];

        if (!overwrited) return resource = host.js + '/' + resource;
        overwrited = overwrited[module];
        if (!overwrited) return resource = host.js + '/' + resource;

        overwrited = overwrited[path];

        if (typeof overwrited === 'string')
            return beyond.hosts.application.js + '/custom/' + library + '/' + module + '/static/' + overwrited;

        return resource = host.js + '/' + resource;

    };

    var setHosts = function (styles) {

        // find variables
        var variable;

        var replace = {};

        var regexp = /#host\.(.*?)#\/(.*?)[\)\s]/g;
        variable = regexp.exec(styles);

        var resource;
        while (variable) {

            var library = variable[1];
            resource = variable[2];
            resource = getResource(library, resource);

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
