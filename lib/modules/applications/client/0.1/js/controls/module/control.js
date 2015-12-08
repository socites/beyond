function Control(specs, page) {
    "use strict";

    Module.call(this, 'control', specs);

    Object.defineProperty(this, 'page', {
        'get': function () {
            return page;
        },
        'set': function (value) {
            page = value;
        }
    });

    Object.defineProperty(this, 'orphan', {
        'get': function () {
            return !page;
        }
    });

    this.show = function () {

        if (!controller) {
            console.error('controller not loaded');
            return;
        }

        controller.show();
        if (this.type === 'page') this.controls

    };

    this.hide = function () {

        if (!controller) {
            console.error('controller not loaded');
            return;
        }

        controller.hide();

    };

};
