require('colors');
module.exports = function (destination) {
    "use strict";

    let fs = require('fs');

    // destination root must exist
    if (destination.root && !(fs.existsSync(destination.root))) {
        throw new Error('destination root "'.red + (destination.root).bold.red + '" does not exist'.red);
    }

    let folders = destination.path;
    let isAbsolute = require('path').isAbsolute(folders);
    folders = destination.path.split(require('path').sep);

    let path;
    if (isAbsolute) {
        folders.shift();
        path = '/' + folders.shift();
    }
    else {
        path = destination.root;
    }

    for (let i in folders) {

        path = require('path').join(path, folders[i]);

        let exists = fs.existsSync(path);
        if (exists) continue;

        fs.mkdirSync(path);

    }

};
