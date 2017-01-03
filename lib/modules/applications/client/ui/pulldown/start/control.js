function Control(createFnc) {
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

    var onReady = Delegate(this, function () {

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
        'setParentScroller', onReady);

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

            if (parentScroller) {
                throw new Error('parentScroller already set');
            }

            parentScroller = value;
            coordinate.done('setParentScroller');

        }
    });

}
