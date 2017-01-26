module.exports = function (module, config) {
    "use strict";

    let async = require('async');

    let multilanguage = [];

    if (config.code && config.code.multilanguage) {
        multilanguage.push('code');
    }
    if (config.control && config.control.multilanguage) {
        multilanguage.push('control');
    }
    if (config.page && config.page.multilanguage) {
        multilanguage.push('page');
    }

    Object.defineProperty(this, 'required', {
        'get': function () {
            return !!multilanguage.length;
        }
    });

    this.process = async(function *(resolve, reject) {

        if (!multilanguage.length) {
            resolve();
            return;
        }

        let script = '';
        script += 'beyond.modules.multilanguage.set(\'' + module.ID + '\', ' + JSON.stringify(multilanguage) + ');\n';
        resolve(script);

    });

};
