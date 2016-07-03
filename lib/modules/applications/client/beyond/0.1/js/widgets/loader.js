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

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }
        callbacks.push(callback);

    };

}
