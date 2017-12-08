function Beyond() {
    "use strict";

    var model = module.model;

    model.factories.register('applications', Application(model.Item({
        'server': {
            'module': module,
            'path': '/applications'
        }
    })));
    model.factories.register('libraries', Library(model.Item({
        'server': {
            'module': module,
            'path': '/libraries'
        }
    })));

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
