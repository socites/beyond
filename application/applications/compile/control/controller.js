function Controller(change, dependencies, properties, specs) {
    "use strict";

    var application;
    Object.defineProperty(this, 'application', {
        'get': function () {
            return application;
        }
    });

    Object.defineProperty(this, 'ready', {
        'get': function () {
            return (!!application && application.loaded);
        }
    });

    this.update = function () {

        if (!properties.application) {
            application = undefined;
            change();
            return;
        }

        if (application && application.id === properties.application) {
            return;
        }

        var applications = dependencies.beyond.factories.applications;

        application = applications.get(properties.application);
        application.bind('change', change);

        application.load();

    };

}
