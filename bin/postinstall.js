module.exports = function () {
    "use strict";

    let childProcess = require('child_process');
    let cwd = require('path').join(process.cwd(), 'lib/modules/applications/client/vendor/0.0.1');

    // cd lib/modules/applications/client/vendor/0.0.1 && bower cache clean && bower install
    console.log('cd ' + cwd);

    let cmd = 'if [[ "$(id -u)" != "0" ]]; ' +
        'then sudo chown -R $USER ~/.config/configstore && ' +
        'bower install; else bower install --allow-root; fi';

    /* Try to find out OS */
    let isWin = /^win/.test(process.platform);

    if (isWin) {
        cmd = 'bower install --allow-root';
    }

    childProcess.execSync(
        cmd, {
            'cwd': cwd,
            'stdio': [0, 1, 2]
        });

};
