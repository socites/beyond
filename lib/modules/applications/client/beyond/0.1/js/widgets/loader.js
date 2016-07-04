function WidgetLoader(module, dependencies, events) {

    var control;
    Object.defineProperty(this, 'control', {
        'get': function () {
            return control;
        }
    });

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return ready;
        }
    });

    var properties = {};
    this.set = function (property, value) {

        properties[property] = value;
        if (control && typeof control.set === 'function') {
            control.set(property, value);
        }

    };

    var callbacks = [];
    var done = function () {

        control = new module.dependencies.Widget(events, properties);
        if (showing && typeof control.show === 'function') {
            control.show();
        }

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }
        callbacks = [];

    };

    var coordinate = new Coordinate(
        'dependencies',
        'container',
        done);

    dependencies = new Dependencies(module, dependencies);
    dependencies.done(coordinate.dependencies);

    this.render = function (container) {

        module.container = container;
        coordinate.done('container');

    };

    var showing = false;
    this.show = function () {
        if (control && typeof control.show === 'function') control.show();
        showing = true;
    };

    this.hide = function () {
        if (control && typeof control.hide === 'function') control.hide();
        showing = false;
    };

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }
        callbacks.push(callback);

    };

}
