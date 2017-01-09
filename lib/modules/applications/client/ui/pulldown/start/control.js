function Control(control, dependencies, createFnc) {
    "use strict";

    var scroller;
    var BaseControl, baseControl;

    var timer = setTimeout(function () {
        console.warn('Coordinate not finished its tasks', coordinate.tasks);
    }, 2000);

    var onReady = Delegate(this, function () {

        clearTimeout(timer);

        baseControl = new BaseControl(control, createFnc);
        BaseControl = undefined;

    });

    var coordinate = new Coordinate(
        'baseControl',
        'scrollerSet',
        'controlReady',
        'dependencies', onReady);

    dependencies.done(coordinate.dependencies);

    if (!control.overwriteScroller) {
        coordinate.done('scrollerSet');
    }

    require([module.ID], function (_BaseControl) {
        BaseControl = _BaseControl;
        coordinate.done('baseControl');
    });

    Object.defineProperty(this, 'scroller', {
        'get': function () {
            return scroller;
        },
        'set': function (value) {

            if (!control.overwriteScroller) {
                console.error('Control did not set overwrite-scroller property');
            }
            if (scroller) {
                throw new Error('scroller already set');
            }

            scroller = value;
            coordinate.done('scrollerSet');

        }
    });

    this.setControlReady = function () {
        coordinate.done('controlReady');
    };

}
