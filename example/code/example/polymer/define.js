var Loader = function () {

    var events = new Events({'bind': this});

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    Polymer.import([], function () {

        ready = true;
        events.trigger('ready');

    });

};

//noinspection JSUnresolvedFunction
define(function () {

    var loader = new Loader();
    return loader;

});
