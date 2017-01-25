module.exports = function (application, library, version, excludes, runtime) {
    "use strict";

    Object.defineProperty(this, 'name', {
        'get': function () {
            return library.name;
        }
    });
    Object.defineProperty(this, 'version', {
        'get': function () {
            return version.version;
        }
    });

    this.modules = new (require('./modules.js'))(library, version, excludes, runtime);
    this.start = require('./start')(application, library, this.modules, version.start);

    this.build = library.build;

};
