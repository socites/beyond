module.exports = function () {

    // If a file with name "server" exists in the root of the project,
    // Then bower install is avoided
    const fs = require('fs');
    let serverFile = require('path').resolve(process.cwd(), '../../server');

    console.log('Checking if server file exists to avoid installing bower', serverFile);
    if (fs.existsSync(serverFile)) {
        console.log('Bower install is avoided due to server file is present in main directory');
        return;
    }

    let childProcess = require('child_process');
    let cwd = require('path').join(process.cwd(), 'lib/client/vendor');

    // cd lib/client/vendor/0.0.1 && bower cache clean && bower install
    console.log('cd ' + cwd);

    let cmd;

    /* Try to find out OS */
    let isWin = /^win/.test(process.platform);

    if (isWin) {
        cmd = 'bower install --allow-root';
    }
    else {
        cmd = 'if [ `id -u` != "0" ]; ' +
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
