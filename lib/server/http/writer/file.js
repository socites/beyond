module.exports = function (response, resource) {
    "use strict";

    let co = require('co');
    let fs = require('co-fs');

    co(function *() {

        try {

            let plain = ['text/html', 'text/plain', 'application/javascript', 'text/css', 'text/cache-manifest'];
            if (plain.indexOf(resource.contentType) !== -1) {

                let content = yield fs.readFile(resource.file, {'encoding': 'UTF8'});

                response.writeHead(200, {
                    'Content-Type': resource.contentType,
                    'Content_Length': content.length
                });

                response.end(content);

            }
            else {

                let content = yield fs.readFile(resource.file);

                response.writeHead(200, {
                    'Content-Type': resource.contentType,
                    'Content_Length': content.length
                });

                response.write(content, 'binary');
                response.end();

            }

        }
        catch (exc) {

            require('./500.js')(response, exc);
            console.log(exc.stack);

        }

    });

};
