module.exports = function (specs) {
    "use strict";

    if (typeof specs !== 'object') throw new Error('invalid arguments on resource constructor');

    // Used by the builder to know where is the relative path of the static file
    Object.defineProperty(this, 'relative', {
        'get': function () {
            return specs.relative;
        }
    });

    if (specs.file) {

        let contentTypes = require('./content-types.js');

        let extname = require('path').extname(specs.file);
        let contentType = contentTypes[extname];
        if (!contentType) contentType = 'text/plain';

        this.type = 'file';
        this.file = specs.file;
        this.contentType = contentType;

    }
    else if (specs['404']) {

        this.type = '404';
        this.content = specs['404'];
        this.contentType = 'text/plain';

    }
    else if (typeof specs.content === 'string') {

        let contentTypes = require('./content-types.js');

        this.type = 'content';
        this.content = specs.content;
        this.contentType = contentTypes[specs.contentType];
        if (!this.contentType) this.contentType = 'text/plain';

    }
    else throw new Error('invalid specification on resource constructor');

};
