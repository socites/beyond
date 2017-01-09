function Control(dependencies, createFnc) {
    "use strict";

    var coordinate = new Coordinate(
        'controlReady',
        'dependencies', render);

    dependencies.done(coordinate.dependencies);

    var timer = setTimeout(function () {
        console.warn('Coordinate not finished its tasks', coordinate.tasks);
    }, 2000);

    function render() {

        clearTimeout(timer);

        var ReactDOM = dependencies.modules.ReactDOM;
        var reactElement = createFnc();
        ReactDOM.render(reactElement, host);

    }

    this.setControlReady = function () {
        coordinate.done('controlReady');
    };

}
