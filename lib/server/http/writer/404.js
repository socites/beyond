module.exports = function (response, resource) {
    "use strict";

    try {

        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        let content = "404 - not found\n";
        if (resource) content += '\n\n' + resource.content;

        response.write(content);
        response.end();

    }
    catch (exc) {
        console.log(exc.stack);
    }

};
