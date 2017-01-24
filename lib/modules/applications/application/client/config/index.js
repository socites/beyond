module.exports = function (application, runtime) {

    let async = require('async');

    this.script = async(function *(resolve, reject, language) {
        "use strict";

        if (!language) {
            reject(new Error('language not set'));
            return;
        }

        let Resource = require('path').join(require('main.lib'), 'resource');
        Resource = require(Resource);

        let script = '';

        let hosts = application.hosts(language);
        if (!hosts.application.js) hosts.application.js = './';

        if (runtime.local) {
            let ports = require(require('path').join(require('main.lib'), '/server')).ports;
            hosts.ports = {'http': ports.http, 'ws': ports.rpc};
        }

        hosts = JSON.stringify(hosts);

        let params = application.params;
        params.local = runtime.local;
        params.name = application.name;
        params.language = language;
        params.version = application.version;
        params = JSON.stringify(params);

        let overwrites = JSON.stringify(yield (require('./overwrites.js')(application.template.overwrites)));

        script += '(function(beyond) {\n';
        script += '    beyond.params = ' + params + ';\n';
        script += '    beyond.hosts = ' + hosts + ';\n';
        script += '    beyond.overwrites = ' + overwrites + ';\n';
        script += '})(window.beyond = {});';

        let resource = new Resource({'content': script, 'contentType': '.js'});
        resolve(resource);

    });

};
