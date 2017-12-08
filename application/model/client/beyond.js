function Beyond() {
    "use strict";

    var model = module.model;

    model.factories.register('applications', Application());
    model.factories.register('libraries', Library());

    Object.defineProperty(this, 'factories', {
        'get': function () {
            return model.factories;
        }
    });

    var applications = new Applications();
    Object.defineProperty(this, 'applications', {
        'get': function () {
            return applications;
        }
    });

    var libraries = new Libraries();
    Object.defineProperty(this, 'libraries', {
        'get': function () {
            return libraries;
        }
    });

}
