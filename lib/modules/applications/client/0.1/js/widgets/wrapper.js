function WidgetWrapper(dependencies) {

    return function () {

        var widget;
        var events = new Events({'bind': this});

        widget = new WidgetLoader(dependencies, events);

        Object.defineProperty(this, 'control', {
            'get': function () {
                return widget.control;
            }
        });

        Object.defineProperty(this, 'ready', {
            'get': function () {
                return widget.ready;
            }
        });

        this.done = function (callback) {
            widget.done(callback);
        };

        this.render = function (container) {
            widget.render(container);
        };

    };

}
