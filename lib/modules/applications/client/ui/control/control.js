if (!beyond.ui) {
    beyond.ui = {};
}

function Control(dependencies, createFnc) {
    "use strict";

    var host;
    Object.defineProperty(this, 'host', {
        'get': function () {
            return host;
        },
        'set': function (value) {
            host = value;
            coordinate.done('setHost');
        }
    });

    var active;
    Object.defineProperty(this, 'active', {
        'get': function () {
            return !!active;
        },
        'set': function (value) {
            active = !!value;
        }
    });

    function render() {

        var ReactDOM = dependencies.modules.ReactDOM;
        var reactElement = createFnc();
        ReactDOM.render(reactElement, host);

    }

    var coordinate = new Coordinate(
        'setHost',
        'dependencies', render);

    dependencies.done(coordinate.dependencies);

}
