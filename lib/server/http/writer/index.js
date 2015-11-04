module.exports = function (response, resource) {

    if (resource.type === '404') require('./404.js')(response, resource);
    else if (resource.type === 'file') require('./file.js')(response, resource);
    else if (resource.type === 'content') {

        response.writeHead(200, {
            'Content-Type': resource.contentType,
            'Content_Length': resource.content.length
        });
        response.end(resource.content);

    } else require('./500.js')(response, new Error('error processing resource'));

};
