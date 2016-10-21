module.exports = function () {
    "use strict";

    let childProcess = require('child_process');
    let cwd = require('path').join(process.cwd(), 'lib/modules/applications/client/vendor/0.0.1');

    // cd lib/modules/applications/client/vendor/0.0.1 && bower cache clean && bower install
    console.log('cd ' + cwd);

    let cmd;

    /* Try to find out OS */
    let isWin = /^win/.test(process.platform);

    if (isWin) {
        cmd = 'bower install --allow-root';
    }
    else {
        cmd = 'if [[ "$(id -u)" != "0" ]]; ' +
            'then sudo chown -R $USER ~/.config/configstore && ' +
            'bower install; else bower install --allow-root; fi';
    }
    childProcess.execSync(
        cmd, {
            'cwd': cwd,
            'stdio': [0, 1, 2]
        });

    if (isWin) {
        cmd = 'rmdir bower_components\\font-roboto /s /q';
    }
    else {
        cmd = 'rm -r bower_components/font-roboto';
    }
    console.log(cmd + '\n');
    childProcess.execSync(
        cmd, {
            'cwd': cwd,
            'stdio': [0, 1, 2]
        });

    if (isWin) {
        cmd = 'ren bower_components\\font-roboto-local font-roboto';
    }
    else {
        cmd = 'mv bower_components/font-roboto-local bower_components/font-roboto';
    }
    console.log(cmd + '\n');
    childProcess.execSync(
        cmd, {
            'cwd': cwd,
            'stdio': [0, 1, 2]
        });

};
