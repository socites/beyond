function Beyond(model) {
    "use strict";

    model.factories.register('applications', Application);

    var applications = new Applications(model);
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

    model.factories.register('libraries', Library);

    var libraries = new Libraries(model);
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return libraries;
        }
    });

}
