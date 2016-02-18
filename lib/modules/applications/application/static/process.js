var async = require('async');

module.exports = async(function *(resolve, reject, resource, application, runtime, language) {
    "use strict";

    if (!language) {
        reject(new Error('language not set'));
        return;
    }

    let filename = require('path').basename(resource.file);
    if (resource.contentType === 'text/html' && ['index.html', 'index.htm'].indexOf(filename) !== -1) {

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

        let fs = require('co-fs');
        let content = yield fs.readFile(resource.file, 'UTF8');

        let scripts = '';

        let hosts = application.hosts(language);
        hosts.application = hosts.application.js;
        hosts.beyond = hosts.libraries.beyond;

        for (let library in hosts.libraries) {

            let host = hosts.libraries[library];

            let replace = '#beyond.libraries.' + library + '#';
            let regexp = new RegExp('(' + replace + ')', 'ig');
            content = content.replace(regexp, host.js);

        }

        let replace = '#beyond.application#';
        let regexp = new RegExp('(' + replace + ')', 'ig');
        content = content.replace(regexp, hosts.application);

        resource = new Resource({'type': 'content', 'content': content, 'contentType': '.html'})
        resolve(resource);

    }
    else resolve(resource);

});
