module.exports = function () {
    "use strict";

    let childProcess = require('child_process');
    let cwd = require('path').join(process.cwd(), 'lib/modules/applications/client/vendor/0.0.1');

    // cd lib/modules/applications/client/vendor/0.0.1 && bower cache clean && bower install
    console.log('cd ' + cwd);

    childProcess.execSync('if [[ "$(id -u)" != "0" ]]; then sudo chown $USER -R ~/.config/configstore && bower install; else bower install --allow-root; fi', {
        'cwd': cwd,
        'stdio': [0, 1, 2]
    });

};
