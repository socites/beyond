var async = require('async');

module.exports = function (application, config, runtime) {
    "use strict";

    this.custom = new (require('./custom'))(application, config.overwrites);

    let start = new (require('./start'))(application, config.overwrites, config.start);

    this.script = async(function *(resolve, reject, resource, language) {
        "use strict";

        if (resource === 'config.js') {
            resolve(yield require('./config.js')(application, language, runtime));
            return;
        }
        else if (resource === 'start.js') {
            resolve(yield start.script(language, runtime));
            return;
        }

    });

};
