module.exports = require('async')(function *(resolve, reject, source, target) {
    "use strict";

    if (require('path').basename(source) === '.DS_Store') {
        resolve();
        return;
    }

    let mkdir = require('../mkdir');
    yield mkdir(require('path').dirname(target));

    (function () {

        let cbCalled;
        let fs = require('fs');

        let done = function (error) {

            if (error) {
                console.log(error);
                throw new Error('error copying file: "' + source + '" to "' + target + '"', error);
            }

            if (!cbCalled) {
                resolve();
                cbCalled = true;
            }

        };

        let rd = fs.createReadStream(source);
        rd.on("error", function (error) {
            done(error);
        });


        let wr = fs.createWriteStream(target);
        wr.on("error", function (error) {
            done(error);
        });
        wr.on("close", function (ex) {
            done();
        });
        rd.pipe(wr);

    })();

});
