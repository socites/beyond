var async = require('async');

module.exports = async(function *(resolve, reject, resource, module, specs) {
    "use strict";

    if (resource.contentType === 'text/html') {

        let Resource = require('beyond.js/lib/modules/utils/resource');
        let fs = require('co-fs');
        let content = yield fs.readFile(resource.file, 'UTF8');

        let hosts;
        if (module.application) hosts = application.hosts;
        if (hosts) hosts = hosts.libraries;

        for (let name in hosts) {

            let library = hosts[name];
            let regexp = new RegExp('(#library:' + name + '#', '/i');
            content = content.replace(regexp, library.hosts.js);

        }

        resource = new Resource({'type': 'content', 'content': content, 'contentType': '.html'});
        resolve(resource);

    }
    else resolve(resource);

});
