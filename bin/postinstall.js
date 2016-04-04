module.exports = function () {
    "use strict";

    let childProcess = require('child_process');
    let cwd = require('path').join(process.cwd(), 'lib/modules/applications/client/vendor/0.0.1');

    // cd lib/modules/applications/client/vendor/0.0.1 && bower cache clean && bower install
    console.log('cd ' + cwd);
    childProcess.execSync('bower install', {
        'cwd': cwd,
        'stdio': [0, 1, 2]
    });

};
