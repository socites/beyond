var async = require('async');

module.exports = async(function *(resolve, reject, application, language, runtime) {
    "use strict";

    if (!language) {
        reject(new Error('language not set'));
        return;
    }

    let Resource = require('path').join(require('main.lib'), 'resource');
    Resource = require(Resource);

    let script = '';

    let hosts = application.hosts(language);

    if (runtime.local) {
        let ports = require(require('path').join(require('main.lib'), '/server')).ports;
        hosts.ports = {'http': ports.http, 'ws': ports.rpc};
    }

    hosts = JSON.stringify(hosts);

    let routes = yield application.routes;
    if (!routes) routes = '{}';
    else routes = JSON.stringify(routes);

    let params = application.params;
    params.local = runtime.local;
    params.name = application.name;
    params.language = language;
    params.version = application.version;
    params = JSON.stringify(params);

    let overwrites;
    if (!application.client.custom.static.items) overwrites = '{}';
    else overwrites = JSON.stringify(application.client.custom.static.items);

    let values;
    if (!application.css.values) values = '{}';
    else values = JSON.stringify(application.css.values);

    script += '(function(beyond) {\n';
    script += '    beyond.params = ' + params + ';\n';
    script += '    beyond.hosts = ' + hosts + ';\n';
    script += '    beyond.css = {};\n';
    script += '    beyond.css.values = ' + values + ';\n';
    script += '    beyond.overwrites = ' + overwrites + ';\n';
    script += '    beyond.routes = ' + routes + ';\n';
    script += '})(window.beyond = {});';

    let resource = new Resource({'content': script, 'contentType': '.js'});
    resolve(resource);

});
