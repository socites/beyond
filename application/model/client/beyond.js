function Beyond(model) {
    "use strict";

    var applications = new Applications(model);
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

}
