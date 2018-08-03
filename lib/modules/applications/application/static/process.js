module.exports = require('async')(function* (resolve, reject, resource, application, runtime, language) {
    'use strict';

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

        let head = '';

        let hosts = application.hosts(language);
        hosts.application = hosts.application.js;
        hosts.beyond = hosts.libraries.beyond.js;
        hosts.vendor = hosts.libraries.vendor.js;
        hosts.polymer = hosts.libraries.polymer.js;
        hosts.ui = hosts.libraries.ui.js;

        head += '<!-- --------------------\n';
        head += '     Beyond required head\n';
        head += '     -------------------- -->\n\n';

        if (runtime.build) {
            let build = runtime.build.applications[application.name];
            if (build.client && build.client.mode === 'phonegap') {
                head += '<!-- cordova dependency -->\n';
                head += '<script defer type="application/javascript" src="cordova.js"></script>\n\n';
            }
        }

        head += '<!-- polymer dependencies -->\n';
        let elements = `${hosts.polymer}static/elements`;
        head += `<script defer src="${elements}/webcomponentsjs/webcomponents.min.js"></script>\n`;
        head += `<link rel="import" href="${elements}/polymer/polymer.html"/>\n`;
        head += `<link rel="import" href="${elements}/paper-styles/default-theme.html"/>\n`;
        head += `<link rel="import" href="${elements}/font-roboto/roboto.html"/>\n\n`;

        head += '<!-- required libraries: jquery, require.js, hogan -->\n';
        let modules = `${hosts.vendor}static/modules`;
        head += `<script defer src="${modules}/jquery/jquery.min.js"></script>\n`;
        head += `<script defer src="${modules}/require.js/requirejs.min.js"></script>\n`;
        head += `<script defer src="${modules}/hogan.js/hogan-3.0.2.min.js"></script>\n\n`;

        head += '<!-- application config must be before beyond -->\n';
        head += `<script defer src="${hosts.application}config.js"></script>\n\n`;

        head += '<!-- beyond.js -->\n';
        head += `<script defer src="${hosts.beyond}utils/js.js"></script>\n`;
        head += `<script defer src="${hosts.beyond}core/js.js"></script>\n`;
        head += `<script defer src="${hosts.beyond}routing/js.js"></script>\n`;
        head += `<script defer src="${hosts.vendor}main/code.js"></script>\n`;
        head += `<script defer src="${hosts.ui}toast/code/${language}.js"></script>\n\n`;

        head += '<!-- application start requires beyond, so it must be after beyond -->\n';
        head += `<script defer src="${hosts.application}start.js"></script>\n\n`;

        if (runtime.build) {

            let build = runtime.build.applications[application.name];
            if (build.client && build.client.mode === 'phonegap') {

                head += '<!-- iOS topbar and others -->\n';
                head += `<script defer src="${hosts.vendor}static/mobile/mobile.js"></script>\n\n`;

                head += '<meta http-equiv="Content-Security-Policy" ' +
                    'content="img-src \'self\' ' +
                    'https://content.jwplatform.com ' +
                    'http://content.jwplatform.com ' +
                    'https://assets-jpcust.jwpsrv.com ' +
                    'https://*.youtube.com ' +
                    'http://*.youtube.com ' +
                    'https://*.graphs.social ' +
                    'https://*.facebook.com ' +
                    'https://*.twitter.com ' +
                    'https://*.twimg.com ' +
                    'https://*.google.com ' +
                    'https://*.googleapis.com ' +
                    'https://*.gstatic.com ' +
                    'https://*.mercadopago.com ' +
                    'data:" />' +
                    '\n\n';

            }

        }

        head += '<!-- ------------------\n';
        head += '     end of beyond head\n';
        head += '     ------------------ -->';

        // add a tab in all lines to the head code
        head = head.replace(/\n/g, '\n    ');

        content = content.replace(/(<!--(\s*)#beyond\.head(\s*)-->)/i, head);

        for (let library in hosts.libraries) {

            if (!hosts.libraries.hasOwnProperty(library)) continue;
            let host = hosts.libraries[library];

            let replace = `#beyond.libraries.${library}#`;
            let regexp = new RegExp(`(${replace})`, 'ig');
            content = content.replace(regexp, host.js);

        }

        let replace = '#beyond.application#';
        let regexp = new RegExp(`(${replace})`, 'ig');
        content = content.replace(regexp, hosts.application);

        resource = new Resource({'type': 'content', 'content': content, 'contentType': '.html'})
        resolve(resource);

    }
    else resolve(resource);

});
