function WidgetLoader(module, dependencies, events) {

    if (!dependencies) dependencies = {};

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

    var render = function () {

        control = new module.Control(events);

    };

    var coordinate = new Coordinate(
        'polymerDependencies',
        'requireDependencies',
        'reactReady',
        'containerIsSet',
        render);

    this.render = function (container) {

        module.container = container;
        coordinate.containerIsSet();

    };

    var callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    var deps = [];
    for (var dependency in dependencies.require) {
        deps.push(dependency);
    }

    // Wait for react to be ready if react is on the dependencies list
    if (deps.indexOf('react') !== -1) {
        module.react.done(coordinate.reactReady);
    }
    else {
        coordinate.done('reactReady');
    }

    if (deps.length) {

        require(deps, function () {

            var args = [].slice.call(arguments);
            module.dependencies = {};

            var i;

            i = 0;
            for (var dependency in deps) {
                module.dependencies[dependencies.require[dependency]] = args[i];
                i++;
            }

            ready = true;

            for (i in callbacks) {
                callbacks[i]();
            }
            callbacks = undefined;

            coordinate.done('requireDependencies');

        });

    }
    else {
        coordinate.done('requireDependencies');
    }

    if (dependencies.polymer) {
        beyond.polymer.import(dependencies.polymer, coordinate.polymerDependencies);
    }
    else {
        coordinate.done('polymerDependencies');
    }

}
