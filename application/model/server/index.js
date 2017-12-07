module.exports = function () {
    "use strict";

    this.applications = new (require('./applications'))();
    this.libraries = new (require('./libraries'))();

};
