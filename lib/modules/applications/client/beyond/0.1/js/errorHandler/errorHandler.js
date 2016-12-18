function ErrorHandler() {
    "use strict";

    var events = new Events({'bind': this});

    var errors = new Map();

    Object.defineProperty(this, 'display', {
        'get': function () {
            return !!errors.size;
        }
    });

    this.retry = function () {

        tags.errors.forEach(function (callback) {
            callback();
        });

        errors = new Map();
        events.trigger('change');

    };

    this.registerError = function (tag, callback) {
        errors.set(tag, callback);
        events.trigger('change');
    };

    this.removeError = function (tag) {
        errors.delete(tag);
        events.trigger('change');
    };

}
