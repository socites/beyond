module.exports = require('async')(function *(resolve, reject, resource, application, runtime, language) {
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
        hosts.beyond = hosts.libraries.beyond.js;
        hosts.vendor = hosts.libraries.vendor.js;
        hosts.ui = hosts.libraries.ui.js;

        scripts += '<!-- -------------------------\n';
        scripts += '     beyond required libraries\n';
        scripts += '     ------------------------- -->\n\n';

        if (runtime.build) {
            let build = runtime.build.applications[application.name];
            if (build.mode === 'phonegap') {
                scripts += '<!-- cordova dependency -->\n';
                scripts += '<script defer type="application/javascript" src="cordova.js"></script>\n\n';
            }
        }

        scripts += '<!-- polymer dependencies -->\n';
        scripts += '<script defer src="' + hosts.vendor + 'static/bower_components/webcomponentsjs/webcomponents.min.js"></script>\n';
        scripts += '<link rel="import" href="' + hosts.vendor + 'static/bower_components/polymer/polymer.html"/>\n\n';
        scripts += '<link rel="import" href="' + hosts.vendor + 'static/bower_components/font-roboto/roboto.html"/>\n\n';

        scripts += '<!-- required libraries: jquery, require.js, hogan -->\n';
        scripts += '<script defer src="' + hosts.vendor + 'static/bower_components/jquery/dist/jquery.min.js"></script>\n';
        scripts += '<script defer src="' + hosts.vendor + 'static/require.js/requirejs.min.js"></script>\n';
        scripts += '<script defer src="' + hosts.vendor + 'static/bower_components/hogan.js/web/builds/3.0.2/hogan-3.0.2.min.js"></script>\n\n';

        scripts += '<!-- application config must be before beyond -->\n';
        scripts += '<script defer src="' + hosts.application + 'config.js"></script>\n\n';

        scripts += '<!-- beyond.js -->\n';
        scripts += '<script defer src="' + hosts.beyond + 'main/code.js"></script>\n\n';
        scripts += '<script defer src="' + hosts.vendor + 'main/code.js"></script>\n\n';
        scripts += '<script defer src="' + hosts.ui + 'toast/code/' + language + '.js"></script>\n\n';

        scripts += '<!-- application start requires beyond, so it must be after beyond -->\n';
        scripts += '<script defer src="' + hosts.application + 'start.js"></script>\n\n';

        scripts += '<!-- --------------------------------\n';
        scripts += '     end of beyond required libraries\n';
        scripts += '     -------------------------------- -->';

        // add a tab in all lines to the scripts code
        scripts = scripts.replace(/\n/g, '\n    ');

        content = content.replace(/(<!--(\s*)#beyond\.head(\s*)-->)/i, scripts);

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
