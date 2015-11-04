module.exports = function (response, exc) {
    "use strict";

    try {

        let content = "500 - internal error\n";

        if (typeof exc instanceof Error) content += '\n\n' + exc.stack;
        else content += '\n\n' + exc.toString();

        response.writeHead(500, {
            'Content-Type': 'text/plain',
            'Content_Length': content.length
        });

        response.write(content, "binary");
        response.end();

    }
    catch (exc) {
        console.log(exc.stack);
    }

};
