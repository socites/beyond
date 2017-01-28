module.exports = function (application, config, runtime) {
    "use strict";

    let async = require('async');

    this.custom = new (require('./custom'))(application);

    let start = new (require('./start'))(application, runtime, config.start);
    let appConfig = new (require('./config'))(application, runtime);

    this.script = async(function *(resolve, reject, resource, language) {
        "use strict";

        if (resource === 'config.js') {
            resolve(yield appConfig.script(language));
            return;
        }
        else if (resource === 'start.js') {
            resolve(yield start.script(language));
            return;
        }

    });

};
