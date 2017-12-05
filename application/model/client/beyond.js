function Beyond() {
    "use strict";

    var applications = new Applications();
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

}
