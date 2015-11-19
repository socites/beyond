var async = require('async');

module.exports = async(function *(resolve, reject, resource, module, specs) {
    "use strict";

    if (resource.contentType === 'text/html') {

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

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

        let relative = resource.relative;

        resource = new Resource({
            'type': 'content',
            'content': content,
            'contentType': '.html',
            'relative': relative
        });
        resolve(resource);

    }
    else resolve(resource);

});
