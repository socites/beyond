var async = require('async');

module.exports = function (application, config, runtime) {
    "use strict";

    this.custom = new (require('./custom'))(application, config.overwrites);

    let start = new (require('./start'))(application, runtime, config.overwrites, config.start);
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
