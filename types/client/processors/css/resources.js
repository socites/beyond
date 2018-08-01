function Resources(module) {

    function getResource(hostType, resource) {

        let host, library;
        let modulePath, filePath;

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

            let library = hostType;
            host = beyond.hosts.libraries[library];

            if (!host) {
                console.warn(`Invalid css host on module "${module.ID}", resource "${resource}", library "${library}" is not defined`);
                return;
            }

            if (resource.substr(0, 7) === 'static/') {
                modulePath = 'main';
                filePath = resource.substr(7);
            }
            else {
                let overwrite = resource.split('/static/');
                modulePath = overwrite[0];
                filePath = overwrite[1];
            }

        }

        let overwrites = beyond.overwrites;
        let overwrited;
        if (library) {
            overwrited = overwrites[library];
        }

        if (!overwrited || !overwrited[modulePath] ||
            overwrited[modulePath].indexOf(filePath) === -1) {

            return `${host + modulePath}/static/${filePath}`;
        }

        return `${beyond.hosts.application.js}custom/${library}/${modulePath}/static/${filePath}`;

    }

    function setHosts(styles) {

        // find variables
        let variable;

        let replace = {};

        let regexp = /#host\.(.*?)#(.*?)[\)\s]/g;
        variable = regexp.exec(styles);

        let resource;
        while (variable) {

            // hostType can be 'application', 'module', libraryName
            let hostType = variable[1];
            resource = variable[2];
            resource = getResource(hostType, resource);

            let original = variable[0];
            if (original.substr(original.length - 1) === ')')
                original = original.substr(0, original.length - 1);

            replace[original] = resource;
            variable = regexp.exec(styles);

        }

        // replace #host.* variables with their values
        for (let original in replace) {

            if (!replace.hasOwnProperty(original)) continue;
            resource = replace[original];

            while (styles.indexOf(original) !== -1)
                styles = styles.replace(original, resource);

        }

        return styles;

    }

    this.process = function (styles) {

        // find and replace #host...
        styles = setHosts(styles);
        return styles;

    };

}
