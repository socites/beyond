/**
 * Add and trigger custom events
 *
 * @param specs
 * @constructor
 */
window.Events = function (specs) {
    'use strict';

    if (!specs) specs = {};

    // List of added events
    let listeners = {};

    /*
     * Adds an event with the given name/function
     * @param string $event name for the event
     * @param function $listener function to be executed in this event
     * @return null
     */
    this.bind = function (event, listener, priority) {

        if (typeof listener !== 'function') throw new Error('Listener is not a function');

        this.unbind(event, listener);

        if (typeof listeners[event] === 'undefined') {
            listeners[event] = [];
        }

        listeners[event].push({
            'listener': listener,
            'priority': priority
        });

        return this;

    };

    /*
     * Triggers an event with the given name, passing some data
     *
     * @param string $event name for the event
     * @param mixed $data some data to pass to the event function
     * @return null
     */
    this.trigger = function () {

        let args = Array.prototype.slice.call(arguments);
        let event = args.shift();

        let async, cancellable;
        if (typeof event === 'object') {
            async = event.async;
            cancellable = event.cancellable;
            event = event.event;
        }

        if (typeof async === 'undefined') async = specs.async;

        let callback;
        if (async) {

            callback = args.pop();
            if (typeof callback !== 'function') {
                console.error('invalid trigger, callback must be specified as the last parameter');
                return;
            }

        }

        let events = listeners[event];
        if (!events) {
            if (async) {
                callback();
                return;
            }
            else return;
        }

        events.sort(function (a, b) {
            a = a.priority;
            if (!a) a = 0;

            b = b.priority;
            if (!b) b = 0;

            return b - a;
        });

        let i;

        // collect returned values
        let values = [];

        if (async) {

            let next = function () {

                if (typeof i === 'undefined') {
                    i = 0;
                }
                else {

                    let returned = [].slice.call(arguments);
                    if (returned.length) {

                        if (cancellable) {
                            callback.apply(undefined, returned);
                            return;
                        }

                        values.push(returned);

                    }
                    i++;

                }

                if (events.length === i) {
                    callback(values);
                    return;
                }

                if (!events[i]) {
                    next();
                    return;
                }

                events[i].listener.apply(null, args);

            };

            args.push(next);
            next();

        }
        else {

            for (i in events) {

                if (!events[i]) continue;

                let returned = events[i].listener.apply(null, args);

                if (typeof returned !== 'undefined') {
                    if (cancellable) return returned;
                    else values.push(returned);
                }

            }

            return values;

        }

    };

    /*
     * Just for debugging purposes,
     * list all of the listeners binded to an event
     * @param {type} event
     * @returns {undefined}
     */
    this.list = function (event) {

        console.log('listing listeners of: ' + event);
        for (let i in listeners[event]) {
            let listener = listeners[event][i];
            console.log('priority:' + listener.priority, listener.listener);
        }

    };

    /*
     * Removes an event with the given name
     * @param string $event name for the event
     * @return null
     */
    this.unbind = function (event, listener) {

        if (!event) {
            listeners = {};
            return this;
        }

        if (!listener) {
            delete listeners[event];
            return this;
        }

        let events = listeners[event];
        if (!events) return this;

        let i;
        for (i in events)
            if (events[i].listener === listener) delete events[i];

        return this;

    };

    if (specs.bind) {

        let object = specs.bind;
        let events = this;

        object.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        object.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };

    }

};
