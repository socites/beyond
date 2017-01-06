function Control(control, dependencies, createFnc) {
    "use strict";

    var host, parentScroller;
    var BaseControl, baseControl;

    var ready;
    Object.defineProperty(this, 'ready', {
        'get': function () {
            return !!ready;
        }
    });

    var callbacks = [];
    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

    var timer = setTimeout(function () {
        console.warn('Coordinate not finished its tasks', coordinate.tasks);
    }, 2000);

    var onReady = Delegate(this, function () {

        clearTimeout(timer);

        ready = true;
        for (var i in callbacks) {
            callbacks[i]();
        }

        callbacks = undefined;

        baseControl = new BaseControl(this, createFnc);
        BaseControl = undefined;

    });

    var coordinate = new Coordinate(
        'baseControl',
        'setHost',
        'setParentScroller',
        'dependencies', onReady);

    dependencies.done(coordinate.dependencies);

    if (!control.overwriteScroller) {
        coordinate.done('setParentScroller');
    }

    require([module.ID], function (_BaseControl) {
        BaseControl = _BaseControl;
        coordinate.done('baseControl');
    });

    Object.defineProperty(this, 'host', {
        'get': function () {
            return host;
        },
        'set': function (value) {

            if (host) {
                throw new Error('host already set');
            }

            host = value;
            coordinate.done('setHost');

        }
    });

    Object.defineProperty(this, 'parentScroller', {
        'get': function () {
            return parentScroller;
        },
        'set': function (value) {

            if (!control.overwriteScroller) {
                console.error('Control did not set overwrite-scroller property');
            }
            if (parentScroller) {
                throw new Error('parentScroller already set');
            }

            parentScroller = value;
            coordinate.done('setParentScroller');

        }
    });

}
