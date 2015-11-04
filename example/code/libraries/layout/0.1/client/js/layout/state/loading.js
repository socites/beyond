var Loading = function ($container) {
    "use strict";

    var events = new Events();
    this.bind = function (event, listener) {
        return events.bind(event, listener);
    };
    this.unbind = function (event, listener) {
        return events.unbind(event, listener);
    };

    var list = [];

    this.show = function (component) {

        if (!component) return;

        list.push(component);

        if (list.length === 1) {
            if ($container) $container.addClass('show');
        }

    };

    this.hide = function (component) {

        if (typeof component === 'undefined') return;

        list.splice(list.indexOf(component), 1);
        if (!list.length) {
            if ($container) $container.removeClass('show');
            events.trigger('loaded');
        }

    };

};
