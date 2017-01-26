module.exports = function (module, config) {
    "use strict";

    let async = require('async');
    let types = require(require('path').join(require('main.lib'), 'types'));

    let multilanguage = [];

    for (let type in types.registered) {
        if (config[type] && config[type].multilanguage) {
            multilanguage.push(type);
        }
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
