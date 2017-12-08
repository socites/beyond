function Controller(change, dependencies, properties, specs) {
    "use strict";

    var applications = dependencies.beyond.applications;
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

    applications.bind('change', change);
    if (!applications.loaded) {
        applications.load({'items': true});
    }

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return true;
        }
    });

}
