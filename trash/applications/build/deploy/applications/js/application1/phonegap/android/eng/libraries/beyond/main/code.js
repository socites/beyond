/*******************
LIBRARY NAME: beyond
MODULE: .
********************/

(function () {

    /***************
    system/events.js
    ***************/
    
    /*
     * Add and trigger custom events
     */
    window.Events = function (specs) {
        "use strict";
    
        if (!specs) specs = {};
    
        // List of added events
        var listeners = {};
    
        /*
         * Adds an event with the given name/function
         * @param string $event name for the event
         * @param function $listener function to be executed in this event
         * @return null
         */
        this.bind = function (event, listener, priority) {
    
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
    
            var args = Array.prototype.slice.call(arguments);
            var event = args.shift();
    
            var async, cancellable;
            if (typeof event === 'object') {
                async = event.async;
                cancellable = event.cancellable;
                event = event.event;
            }
    
            if (typeof async === 'undefined') async = specs.async;
    
            var callback;
            if (async) {
    
                callback = args.pop();
                if (typeof callback !== 'function') {
                    console.error('invalid trigger, callback must be specified as the last parameter');
                    return;
                }
    
            }
    
            var events = listeners[event];
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
    
            var i;
    
            // collect returned values
            var values = [];
    
            if (async) {
    
                var next = function () {
    
                    if (typeof i === 'undefined') {
                        i = 0;
                    }
                    else {
    
                        var returned = [].slice.call(arguments);
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
    
                    var returned = events[i].listener.apply(null, args);
    
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
            for (var i in listeners[event]) {
                var listener = listeners[event][i];
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
    
            var events = listeners[event];
            if (!events) return this;
    
            var i;
            for (i in events)
                if (events[i].listener === listener) delete events[i];
    
            return this;
    
        };
    
        if (specs.bind) {
    
            var object = specs.bind;
            var events = this;
    
            object.bind = function (event, listener) {
                return events.bind(event, listener);
            };
            object.unbind = function (event, listener) {
                return events.unbind(event, listener);
            };
    
        }
    
    };
    
    
    /*****************
    system/delegate.js
    *****************/
    
    window.Delegate = function () {
        "use strict";
    
        var params = Array.prototype.slice.call(arguments);
        var context = params.shift();
        var method;
    
        if (typeof context === 'object') {
    
            method = params.shift();
    
            if (typeof method !== 'function') {
    
                if (typeof method !== 'string') {
                    console.error('invalid delegate function, it must be a method of the object');
                    return;
                }
                else if (typeof context[method] !== 'function') {
                    console.error(
                        'DELEGATE DECLARATION ERROR: method "' +
                        method + '" does not exist in object', context);
                    return;
                }
    
            }
    
        }
        else if (typeof context === 'function') {
            method = context;
            context = undefined;
        }
        else {
            console.error('ERROR: it was expected an object or a function as the first parameter');
            return;
        }
    
        if (typeof method === 'function') {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args = params.concat(args);
                return method.apply(context, args);
            };
        }
        else {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args = params.concat(args);
                return context[method].apply(context, args);
            };
        }
    
    };
    
    
    /****************
    system/browser.js
    ****************/
    
    (function (browser) {
        "use strict";
    
        var agent = navigator.userAgent.toLowerCase();
    
        browser.mozilla = /mozilla/.test(agent) && !/webkit /.test(agent);
        browser.webkit = /webkit/.test(agent);
        browser.opera = /opera/.test(agent);
        browser.msie = /msie/.test(agent);
    
    })(window.browser = {});
    
    
    /*************
    system/time.js
    *************/
    
    /*
     * Returns a string with the corresponding formatted time
     * @param int $timestamp timestamp to be parsed
     * @return string
     */
    window.friendlyTime = function (timestamp, specs) {
        "use strict";
    
        if (!timestamp) return '';
    
        if (!specs) specs = {};
    
        var fullDate = new Date(timestamp * 1000);
        var months = [
            'Ene', 'Feb', 'Mar',
            'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep',
            'Oct', 'Nov', 'Dic'];
    
        var dateObject = {
            'seconds': fullDate.getSeconds(),
            'minutes': fullDate.getMinutes(),
            'hours': fullDate.getHours(),
            'day': fullDate.getUTCDate(),
            'month': months[fullDate.getMonth()],
            'year': fullDate.getFullYear()
        };
    
        var currentDate = new Date();
        currentDate = {
            'seconds': currentDate.getSeconds(),
            'minutes': currentDate.getMinutes(),
            'hours': currentDate.getHours(),
            'day': currentDate.getUTCDate(),
            'month': months[currentDate.getMonth()],
            'year': currentDate.getFullYear()
        };
    
        // Hour and minutes for same day
        var minutes = dateObject.minutes.toString();
        minutes = (minutes.length === 1) ? minutes = '0' + minutes : minutes;
    
        var text = dateObject.hours + ':' + minutes;
    
        // Day and month (textual) for diff day/month from same year
        if (dateObject.year === currentDate.year &&
            (dateObject.day !== currentDate.day || dateObject.month !== currentDate.month)) {
    
            text = dateObject.day + ' ' + dateObject.month + ((specs.forceHour) ? ', ' + text : ' ');
    
        }
    
        // Day, month and year for older years
        if (dateObject.year !== currentDate.year) {
            text = dateObject.day + ' ' + dateObject.month + ' ' + dateObject.year;
        }
    
        return text;
    
    };
    
    
    /*****************
    system/hashCode.js
    *****************/
    
    // Convert strings to an integer hash
    String.prototype.hashCode = function () {
    
        var hash = 0, i = 0, len = this.length, chr;
    
        while (i < len) {
            hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
        }
    
        hash = (hash + 2147483647) + 1;
    
        return hash;
    
    };
    
    
    /*******************
    system/coordinate.js
    *******************/
    
    window.Coordinate = function () {
        "use strict";
    
        var tasks = {};
        Object.defineProperty(this, 'tasks', {
            'get': function () {
                return tasks;
            }
        });
    
        var callback;
        var fired = 0;
    
        var args = [].slice.call(arguments);
    
        for (var i in args) {
    
            if (args[i] instanceof Array) {
                for (var j in args[i]) {
                    tasks[args[i][j]] = false;
                }
            }
    
            if (typeof args[i] === 'string') tasks[args[i]] = false;
            if (typeof args[i] === 'function') callback = args[i];
    
        }
    
        for (var task in tasks) {
    
            (function (task, coordinator) {
    
                coordinator[task] = Delegate(coordinator, function () {
                    coordinator.done(task);
                });
    
            })(task, this);
    
        }
    
        if (!callback) {
            console.error('invalid tasks coordination callback');
            return;
        }
    
        // @anyway fire the callback even if it was previously fired
        var check = function (anyway) {
    
            for (var i in tasks) if (tasks[i] === false) return false;
    
            if (fired && !anyway) {
                return;
            }
    
            fired++;
            callback();
    
            return true;
        };
    
        this.done = function (task, anyway) {
    
            if (typeof tasks[task] !== 'boolean') {
                console.warn('invalid task');
                return;
            }
    
            tasks[task] = true;
            check(anyway);
    
        };
    
        this.fire = function () {
            check(true);
        };
    
    };
    
    
    /******************
    system/camelcase.js
    ******************/
    
    String.prototype.camelTo_ = function () {
        "use strict";
    
        return (this.replace(/\W+/g, '_')
            .replace(/([a-z0-9\d])([A-Z0-9])/g, '$1_$2')).toLowerCase();
    
    };
    
    String.prototype._ToCamel = function () {
        "use strict";
    
        return this.replace(/_([a-z0-9])/g, function (m, w) {
            return w.toUpperCase();
        });
    
    };
    
    
    
    /*****************
    sockets/sockets.js
    *****************/
    
    var Sockets = function () {
        "use strict";
    
        var events = new Events({'bind': this});
    
        /**
         * Triggers the connect:before event that can be extended by binding
         * to beyond.sockets.bind('connect:before', query, host)
         *
         * @param host {string} The host where the connection is going to be stablished
         * @returns {object} The connection query
         */
        this.getConnectionParams = function (host) {
    
            var query = {};
            events.trigger('connect:before', query, host);
            return query;
    
        };
    
    };
    
    
    /**********************
    sockets/exportSocket.js
    **********************/
    
    function exportSocket(exports, beyond, host) {
        "use strict";
    
        if (beyond.params.local && host.substr(0, 1) === '/') {
            host = location.hostname + ':' + beyond.hosts.ports.ws + host;
        }
    
        var io, socket;
    
        var callbacks = [];
        exports.socket = function (callback) {
    
            if (socket) {
                callback(socket);
                return;
            }
    
            callbacks.push(callback);
    
        };
    
        function createSocket() {
    
            var query = beyond.sockets.getConnectionParams(host);
            var qstring = '';
            for (var variable in query) {
                if (qstring) qstring += '&';
                qstring += variable + '=' + query[variable];
            }
    
            socket = io.connect(host, {'query': qstring, 'reconnection': false});
    
            for (var i in callbacks) callbacks[i](socket);
            callbacks = [];
    
        }
    
        require(['socket.io'], function (_io) {
            io = _io;
            createSocket();
        });
    
    }
    
    
    /*********************
    libraries/libraries.js
    *********************/
    
    var Libraries = function (beyond) {
        "use strict";
    
        var items = {};
        var keys = [];
        Object.defineProperty(this, 'items', {
            'get': function () {
                return items;
            }
        });
        Object.defineProperty(this, 'keys', {
            'get': function () {
                return keys;
            }
        });
        Object.defineProperty(this, 'length', {
            'get': function () {
                return keys.length;
            }
        });
    
        this.get = function (name) {
    
            if (items[name]) return items[name];
    
            var library = new Library(beyond, name);
            items[name] = library;
            keys.push(name);
    
            return library;
    
        };
    
    };
    
    
    /*******************
    libraries/library.js
    *******************/
    
    var Library = function (beyond, name) {
        "use strict";
    
        Object.defineProperty(this, 'name', {
            'get': function () {
                return name;
            }
        });
    
        Object.defineProperty(this, 'version', {
            'get': function () {
                return beyond.hosts.libraries[name].version;
            }
        });
    
        Object.defineProperty(this, 'path', {
            'get': function () {
                return 'libraries/' + name;
            }
        });
    
        var host = beyond.hosts.libraries[name].ws;
        if (host) {
            exportSocket(this, beyond, host);
        }
    
    };
    
    
    /***********************
    navigation/pages/base.js
    ***********************/
    
    function PageBase(props, $container, vdir, dependencies) {
        "use strict";
    
        var search, querystring;
        Object.defineProperty(props, 'search', {
            'get': function () {
                return search;
            },
            'set': function (value) {
                search = value;
                querystring = new QueryString(value);
            }
        });
    
        var state;
        Object.defineProperty(props, 'state', {
            'get': function () {
                return state;
            },
            'set': function (value) {
                state = value;
            }
        });
    
        Object.defineProperty(this, '$container', {
            'get': function () {
                return $container;
            }
        });
        Object.defineProperty(this, 'vdir', {
            'get': function () {
                return vdir;
            }
        });
        Object.defineProperty(this, 'dependencies', {
            'get': function () {
                return dependencies.modules;
            }
        });
        Object.defineProperty(this, 'querystring', {
            'get': function () {
                return querystring;
            }
        });
        Object.defineProperty(this, 'state', {
            'get': function () {
                return state;
            }
        });
    
    }
    
    
    /******************************
    navigation/pages/querystring.js
    ******************************/
    
    function QueryString(search) {
        "use strict";
    
        if (search.substr(0, 1) === '?') {
            search = search.substr(1);
        }
    
        search = search.split('&')
    
        if (search == "") return {};
    
        for (var i = 0; i < search.length; ++i) {
    
            var param = search[i].split('=', 2);
            if (param.length != 2) {
                continue;
            }
    
            this[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    
        }
    
    }
    
    
    /***********************
    navigation/pages/page.js
    ***********************/
    
    /* The Page object is a wrapper to the page object created
     from the Page class exposed by the module.
     The Page object creates the container of the page, and it is inserted in the DOM
    
     The module that exposes the Page class is loaded when the dependencies is loaded.
     The dependencies are specified in the specs object.
     The specs object is registered in the start.js script by beyond.
    
     Once the dependencies are loaded, then the Page class is instantiated.
     Then the "preview" method is called (if exists). After calling the "preview" method, then the "prepare" method
     is called. The "prepare" method is asynchronous, and it is also optional.
     After the "prepare" method is executed (only if exists), then the render method is executed.
     Finally the show method is executed, only if the page was not hidden before.
    
     If an error occurs, it is exposed in the "error" attribute.
     */
    function Page(module, pathname, vdir, specs) {
        "use strict";
    
        var events = new Events({'bind': this});
    
        // The instance of the Page class exposed by the module
        var control;
        // To expose privately some properties of the page
        var props;
    
        // showTime indicates when the page has to be shown.
        // It allows to give the time of the transition of the page to be hidden
        // without interfering with the transition of the active page being shown.
        // showTime is set by the navigation object when calling the .show method.
        // When the .hide method is called, the showTime is set as undefined,
        // meaning that this page is not currently active.
        var showTime;
    
        // Is it the page active?
        Object.defineProperty(this, 'active', {
            'get': function () {
                // If the showTime was set, then the page is considered as active
                return !!showTime;
            }
        });
    
        Object.defineProperty(this, 'pathname', {
            'get': function () {
                return pathname;
            }
        });
    
        Object.defineProperty(this, 'vdir', {
            'get': function () {
                return vdir;
            }
        });
    
        var state;
        Object.defineProperty(this, 'state', {
            'get': function () {
                return state;
            },
            'set': function (value) {
                state = value;
                if (props) {
                    props.state = value;
                }
            }
        });
    
    
        // The location.search of the page
        var search;
        Object.defineProperty(this, 'search', {
            'get': function () {
                return search;
            },
            'set': function (value) {
                search = value;
                if (props) {
                    props.search = value;
                }
            }
        });
    
        // Create the container of the page
        var $container = $('<div style="display: none; opacity: 0;" class="beyond-page"/>')
            .attr('pathname', pathname);
    
        $('body > .app-container').append($container);
    
        var error;
        Object.defineProperty(this, 'error', {
            'get': function () {
                return error;
            }
        });
    
        var ready, rendered;
    
        var showing;
        var showed; // Assure to call the show function only once
        var show = Delegate(this, function () {
    
            if (!showTime || !ready || showing || showed) {
                return;
            }
    
            showed = true;
            showing = true;
            $container.show();
    
            // The container has to be shown 500ms after the .show method was called
            // to let the animation of the previous page to be hidden.
            // But as it is required some time to load the dependencies of this page, and also the prepare
            // method can take extra time, it should probably be started before the 500ms.
            var timer = showTime - Date.now();
            if (timer < 0) timer = 0;
    
            setTimeout(function () {
    
                // In case that the page was hidden before it had the time to be executed
                if (!showTime) return;
    
                showing = false;
    
                // In case that the page has navigated another page.
                if (beyond.pathname === pathname) {
                    $container.addClass('show');
                    $container.css('opacity', '');
                }
    
            }, timer);
    
        });
    
        var prepare = Delegate(this, function (callback) {
    
            var timer = setTimeout(function () {
                console.warn('Page "' + pathname +
                    '" is taking too much time to invoke the callback of the "prepare" function.');
            }, 5000);
    
            control.prepare.call(control, function () {
    
                clearTimeout(timer);
                callback();
    
            });
    
        });
    
        /* Load the dependencies of the Page class. The module that exposes the Page class is
         automatically included by BeyondJS in the list of dependencies.
         */
        var coordinate = new Coordinate('dependencies', 'react', function () {
    
            var Control = dependencies.modules.Page;
    
            if (typeof Control !== 'function') {
                error = 'Invalid control. Module "' + module.ID + '" must expose a function.';
                console.error(error, Control);
                return;
            }
    
            props = {};
            var base = new PageBase(props, $container, vdir, dependencies);
            props.state = state;
            props.search = search;
            Control.prototype = base;
            control = new Control($container, vdir, dependencies.modules);
    
            if (typeof control.preview === 'function') {
                control.preview.call(control);
                ready = true;
                show();
            }
    
            function renderAndShow() {
    
                if (typeof control.render === 'function') {
                    control.render.call(control);
                }
                if (typeof control.show === 'function') {
                    control.show.call(control);
                }
    
                ready = true;
                rendered = true;
                show();
                events.trigger('rendered');
    
            }
    
            // Once the dependencies are loaded, then execute the "prepare" method (optional)
            if (typeof control.prepare === 'function') {
                prepare(renderAndShow);
            }
            else {
                renderAndShow();
            }
    
        });
        var dependencies = new Dependencies(module, specs.dependencies);
    
        var initialised;
        Object.defineProperty(this, 'initialised', {
            'get': function () {
                return !!initialised;
            }
        });
    
        this.initialise = function () {
    
            if (initialised) {
                console.error('Page cannot be initialised twice', pathname);
                return;
            }
            initialised = true;
    
            dependencies.done(coordinate.dependencies);
    
            if (module.react.loading) {
                module.react.done(coordinate.react);
            }
            else {
                coordinate.done('react');
            }
    
        };
    
        this.show = function (_showTime) {
    
            if (destroying) {
                console.error('Page is being destroyed.');
                return;
            }
    
            showTime = _showTime;
            if (!showTime) {
                showTime = Date.now();
            }
    
            show();
    
            if (rendered) {
                if (typeof control.show === 'function') {
                    control.show.call(control);
                }
            }
    
        };
    
        this.hide = function (done) {
    
            if (!showTime) {
                console.warn('Page is already hidden', pathname);
                if (done) done();
                return;
            }
    
            if (!showed) {
                // The show method was never called, so just return
                if (done) done();
                return;
            }
    
            showTime = undefined;
            showed = false;
    
            if (typeof control.hide === 'function') {
                control.hide.call(control);
            }
    
            setTimeout(function () {
    
                // In case that the page was shown again before it had the time to be executed
                if (showTime && !destroying) return;
    
                $container.removeClass('show');
                setTimeout(function () {
    
                    // In case that the page was shown again before it had the time to be executed
                    if (showTime && !destroying) return;
                    $container.hide();
    
                    if (done) done();
    
                }, 300);
    
            }, 200);
    
        };
    
        var destroying;
        this.destroy = function () {
    
            destroying = true;
            this.hide(function () {
    
                // Give time to the transition to end
                setTimeout(Delegate(this, function () {
    
                    if (typeof control.destroy === 'function') {
                        control.destroy.call(control);
                    }
    
                    $container.remove();
    
                }), 500);
    
            });
    
        };
    
    }
    
    
    /************************
    navigation/pages/pages.js
    ************************/
    
    /*
     Factory of pages.
     This object is being exposed in beyond.pages
    
     The modules of type "page" register the pages configuration,
     specifying the route of the page and its dependencies.
    
     Pathnames can dynamically be registered, ex: the url of an article
    
     The get method asynchronously returns a page object, that is a wrapper to the page object
     created from the Page class exposed by the module.
     */
    function Pages(events) {
        "use strict";
    
        // Pages instances
        var pages = {};
    
        // Modules registered as pages
        var modules = {};
    
        // Pages configurations
        var specs = {};
    
        // Registered routes
        // The difference between the routes and the pathnames is that
        // routes are registered in the start.js script, through the specification of the module
        // and the pathnames are registered dynamically (ex, the url of an article)
        var routes = {};
        Object.defineProperty(this, 'routes', {
            'get': function () {
                return routes;
            }
        });
    
        // Registered pathnames who have a known associated moduleID
        var pathnames = {};
        Object.defineProperty(this, 'pathnames', {
            'get': function () {
                return pathnames;
            }
        });
    
        /* Modules of type "page" are registered in the start.js script.
         They pass the module object and the specification of the page,
         with the route and the dependencies of the module. */
        this.register = function (module, _specs) {
    
            var moduleID = module.ID;
    
            var route;
            if (typeof _specs === 'string') {
    
                route = _specs;
                if (route.substr(0, 1) !== '/') route = '/' + route;
                specs[moduleID] = {'route': route};
    
            }
            else if (typeof _specs === 'object') {
    
                if (_specs.route && _specs.route.substr(0, 1) !== '/') {
                    _specs.route = '/' + _specs.route;
                }
    
                route = _specs.route;
                specs[moduleID] = _specs;
    
            }
    
            if (route) {
                routes[route] = moduleID;
            }
            modules[moduleID] = module;
    
        };
    
        // Pathnames can be registered dynamically. By instance, the url of an article.
        this.registerPathname = function (pathname, moduleID) {
    
            if (!modules[moduleID]) {
                console.error('Module "' + moduleID + '" is invalid or is not a registered page.');
                return;
            }
    
            pathnames[pathname] = moduleID;
    
        };
    
        var create = function (pathname, moduleID, state, vdir) {
    
            if (!specs[moduleID]) {
                return 'Module "' + moduleID + '" does not exist.';
            }
    
            var page = new Page(
                modules[moduleID],
                pathname,
                vdir,
                specs[moduleID]);
    
            pages[pathname] = page;
    
            return {
                'page': page,
                'state': state
            };
    
        };
    
        this.remove = function (pathname) {
    
            var page = pages[pathname];
            if (!page) return;
    
            page.destroy();
            delete pages[pathname];
    
        };
    
        // Asynchronously get a page
        this.get = function (pathname, state, callback) {
    
            // If the page is in memory, it is immediately returned.
            var page = pages[pathname];
            if (page) {
                callback({
                    'page': page,
                    'state': state
                });
                return;
            }
    
            // Look for the module in the list of registered routes.
            // routes are specified in the start.js script through the module configuration
            var moduleID = routes[pathname];
            if (!moduleID) {
    
                var path = pathname.split('/');
                var vdir = [];
                var dir;
    
                // The ending part of the pathname specifies the vdir of the page
                // ex: /signin/token, the pathname is /signin and the vdir is the token
                while (dir = path.pop()) {
    
                    vdir.unshift(dir);
                    moduleID = routes[path.join('/')];
                    if (moduleID) {
    
                        callback(create(
                            pathname,
                            moduleID,
                            state,
                            vdir.join('/')
                        ));
                        return;
    
                    }
    
                }
    
            }
    
            if (moduleID) {
                callback(create(pathname, moduleID, state));
                return;
            }
    
            // Look for the module in the list of registered pathnames
            // Pathnames are dynamically registered, ex: the url of an article
            moduleID = pathnames[pathname];
            if (moduleID) {
                callback(create(pathname, moduleID, state));
                return;
            }
    
    
            // If the module is not found, because there is no registered route,
            // or registered pathname, then let the hooks find the appropriate module
            var event = {
                'event': 'routing',
                'cancellable': true,
                'async': true
            };
            events.trigger(event, pathname, function (response) {
    
                if (!response || !response.moduleID) {
    
                    callback('Pathname "' + pathname + '" does not have a module associated to it.');
                    return;
    
                }
    
                var moduleID = response.moduleID;
                var state = response.state;
    
                callback(create(pathname, moduleID, state));
    
            });
    
        };
    
    }
    
    
    /*********************
    navigation/pathname.js
    *********************/
    
    var pathname = function (navigation) {
        "use strict";
    
        var root = '';
        if (navigation.mode === 'hash') {
            root = location.pathname;
        }
        else if (beyond.params.local) {
    
            var pathname = location.pathname.split('/');
            root = [''];
    
            if (pathname[1] === 'applications') root = root.concat(pathname.splice(1, 2));
            if (pathname[1] === 'languages') root = root.concat(pathname.splice(1, 2));
    
            root = root.join('/');
    
        }
    
        Object.defineProperty(navigation, 'root', {
            'get': function () {
                return root;
            }
        });
    
        Object.defineProperty(navigation, 'pathname', {
            'get': function () {
    
                if (navigation.mode === 'hash') {
    
                    var hash = location.hash;
                    if (hash.substr(0, 1) === '#') {
                        hash = hash.substr(1);
    
                        var index = hash.indexOf('?');
                        if (index !== -1) {
                            hash = hash.substr(0, index);
                        }
                    }
                    return '/' + hash;
    
                }
    
                var pathname = location.pathname.substr(root.length);
    
                if (!pathname) pathname = '/';
                else if (pathname && pathname.substr(0, 1) !== '/') pathname = '/' + pathname;
    
                return pathname;
    
            }
        });
    
    };
    
    
    /***********************
    navigation/navigation.js
    ***********************/
    
    function Navigation(beyond, pages, events) {
        "use strict";
    
        // Set pathname as a property of the navigation object.
        pathname(this, events);
        var root = this.root;
    
        var mode = 'pushState';
        if (location.protocol === 'file:') mode = 'hash';
        else if (location.pathname.substr(location.pathname.length - 11) === '/index.html') mode = 'hash';
    
        Object.defineProperty(this, 'mode', {
            'get': function () {
                return mode;
            }
        });
    
        var active, navigating;
        Object.defineProperty(this, 'active', {
            'get': function () {
                return active;
            }
        });
    
        function updateHref(pathname, state) {
    
            var url = pathname;
            if (mode === 'hash') url = '#' + pathname.substr(1);
            if (beyond.params.local) url = root + url;
    
            history.pushState(state, '', url);
    
        }
    
        // On any change in navigation, the variable navigationID increments.
        // Helps to process only the active navigation on asynchronous calls
        // of the pages.get method & the defaultUrl function.
        var navigationID = 0;
    
        var showPage = Delegate(this, function (pathname, search, state, callback) {
    
            if (active && active.pathname === this.pathname) {
                return;
            }
    
            if (active) {
                active.hide();
                active = undefined;
            }
    
            var callID = navigationID;
    
            // showTime defines when the new active page must be shown to give the time to the previous
            // page transition to finish.
            var showTime = Date.now() + 500;
    
            pages.get(pathname, state, function (response) {
    
                if (navigationID !== callID) {
                    // This is a callback function being called from a previous page show.
                    return;
                }
    
                // Response being a string means it is an error
                if (typeof response === 'string') {
                    console.error(response);
                    return;
                }
    
                var page = response.page;
                if (!page) {
                    console.error('Page undefined');
                    return;
                }
    
                history.replaceState(response.state, '', location.href);
    
                if (callback) {
    
                    var onRendered = function () {
                        callback();
                        page.unbind('rendered', onRendered);
                    };
                    page.bind('rendered', onRendered);
    
                }
    
                active = page;
    
                page.state = response.state;
                page.search = search;
                if (!page.initialised) {
                    page.initialise();
                }
                page.show(showTime);
    
            });
    
        });
    
        var defaultUrl = Delegate(this, function (callback) {
    
            var callID = navigationID;
    
            var timer;
            setTimeout(function () {
                if (callID !== navigationID) return;
                console.error('Routing event to get the default page is taking too much time to respond.');
            }, 5000);
    
            var event = {
                'event': 'routing',
                'cancellable': true,
                'async': true
            };
    
            events.trigger(event, '/', function (response) {
    
                clearTimeout(timer);
                if (callID !== navigationID) return;
    
                if (!response) {
                    console.error('Page default is not defined.', response);
                    return;
                }
                if (typeof response !== 'object' || typeof response.pathname !== 'string' || !response.pathname) {
                    console.error('Page default is invalid.', response);
                    return;
                }
                if (response.pathname === '/') {
                    console.error('Default pathname cannot be "/". It would result in an infinity loop.', response);
                    return;
                }
    
                callback(response);
    
            });
    
        });
    
        var navigateDefaultUrl = Delegate(this, function () {
    
            if (navigating === '/') return;
    
            navigationID++;
            navigating = '/';
    
            var callID = navigationID;
    
            defaultUrl(Delegate(this, function (response) {
    
                // In case another updateDefaultUrl call was made and this one is older.
                if (callID !== navigationID) return;
    
                updateHref(response.pathname, response.state);
                updateNavigation();
    
            }));
    
        });
    
        /*
         updateNavigation takes the history.state to use as the parameters to be sent to the page.
         Remember to update the state before calling this function.
         */
        var updateNavigation = Delegate(this, function (callback) {
    
            if (navigating === this.pathname) return;
            backToHome = false;
    
            navigationID++;
            navigating = this.pathname;
    
            var search;
            if (mode === 'hash') {
                var hash = location.hash;
                search = hash.substr(hash.indexOf('?'));
            }
            else {
                search = location.search;
            }
    
            showPage(this.pathname, search, history.state, callback);
    
        });
    
        var onpopstate = Delegate(this, function () {
    
            if (this.pathname === '/') {
                navigateDefaultUrl();
            }
            else {
                updateNavigation();
            }
    
        });
    
        this.navigate = function (pathname, state) {
    
            if (pathname === '/') {
    
                if (typeof state !== 'undefined') {
                    console.warn('Parameters can not be sent to the default page.');
                }
                navigateDefaultUrl();
    
            }
            else {
                updateHref(pathname, state);
                updateNavigation();
            }
    
        };
    
        beyond.done(Delegate(this, function () {
    
            window.addEventListener('popstate', onpopstate);
    
            // Hide the splashscreen
            beyond.phonegap.done(function () {
    
                if (navigator.splashscreen) {
                    setTimeout(function () {
                        navigator.splashscreen.hide();
                    }, 1000);
                }
    
            });
    
            if (location.hash) {
    
                var pathname = location.hash.substr(1);
                if (pathname.substr(0, 1) !== '/') {
                    pathname = '/' + pathname;
                }
    
                beyond.navigate(pathname);
                return;
    
            }
    
            if (this.pathname === '/') {
                navigateDefaultUrl();
            }
            else {
                updateNavigation(function () {
    
                    // Required by phantom
                    $('body').append('<div />').attr('id', 'phantom-ready');
    
                });
            }
    
        }));
    
        var backToHome;
        Object.defineProperty(this, 'backToHome', {
            'get': function () {
                return !!backToHome;
            },
            'set': function (value) {
                // normally this property is set before the navigate,
                // the navigate cleans the backToHome
                setTimeout(function () {
                    backToHome = !!value;
                }, 0);
            }
        });
        Object.defineProperty(beyond, 'backToHome', {
            'get': function () {
                return beyond.navigation.backToHome;
            },
            'set': function (value) {
                beyond.navigation.backToHome = value;
            }
        });
    
        function back() {
            if (!backToHome && history.length) {
                history.back();
            }
            else {
                backToHome = false;
                beyond.navigate('/');
            }
        }
    
        this.back = back;
        beyond.back = back;
    
    }
    
    
    /*********************************
    modules/module/styles/resources.js
    *********************************/
    
    var Resources = function (module) {
        "use strict";
    
        var getResource = function (hostType, resource) {
    
            var host;
            var modulePath, filePath;
    
            if (resource.substr(0, 1) === '/') {
                resource = resource.substr(1);
            }
    
            if (hostType === 'module') {
    
                if (module.library) {
                    host = beyond.hosts.libraries[module.library.name].js;
                    library = module.library.name;
                }
                else {
                    host = beyond.hosts.application.js;
                    library = undefined;
                }
    
                modulePath = module.path;
                filePath = resource;
    
            }
            else if (hostType === 'application') {
    
                host = beyond.hosts.application.js;
                return host + resource;
    
            }
            else {
    
                var library = hostType;
                host = beyond.hosts.libraries[library];
    
                if (!host) {
                    console.warn('invalid css host on module "' + module.ID + '", resource "' + resource + '"' +
                        ', library "' + library + '" is not defined');
                    return;
                }
    
                if (resource.substr(0, 7) === 'static/') {
                    modulePath = 'main';
                    filePath = resource.substr(7);
                }
                else {
                    var overwrite = resource.split('/static/');
                    modulePath = overwrite[0];
                    filePath = overwrite[1];
                }
    
            }
    
            var overwrites = beyond.overwrites;
            var overwrited;
            if (library) {
                overwrited = overwrites[library];
            }
    
            if (!overwrited || !overwrited[modulePath] ||
                overwrited[modulePath].indexOf(filePath) === -1) {
    
                return host + modulePath + '/static/' + filePath;
            }
    
            return beyond.hosts.application.js +
                'custom/' + library + '/' +
                modulePath + '/static/' + filePath;
    
        };
    
        var setHosts = function (styles) {
    
            // find variables
            var variable;
    
            var replace = {};
    
            var regexp = /#host\.(.*?)#(.*?)[\)\s]/g;
            variable = regexp.exec(styles);
    
            var resource;
            while (variable) {
    
                // hostType can be 'application', 'module', libraryName
                var hostType = variable[1];
                resource = variable[2];
                resource = getResource(hostType, resource);
    
                var original = variable[0];
                if (original.substr(original.length - 1) === ')')
                    original = original.substr(0, original.length - 1);
    
                replace[original] = resource;
                variable = regexp.exec(styles);
    
            }
    
            // replace #host.* variables with their values
            for (var original in replace) {
    
                resource = replace[original];
    
                while (styles.indexOf(original) !== -1)
                    styles = styles.replace(original, resource);
    
            }
    
            return styles;
    
        };
    
        this.process = function (styles) {
    
            // find and replace #host...
            styles = setHosts(styles);
            return styles;
    
        };
    
    };
    
    
    /******************************
    modules/module/styles/values.js
    ******************************/
    
    var Values = function (module) {
        "use strict";
    
        // find a css value
        var retrieve = function (value) {
    
            var process = value.split('-');
            value = beyond.css.values;
            for (var i in process) {
    
                value = value[process[i]];
                if (typeof value === 'undefined') return;
    
            }
    
            return value;
    
        };
    
        this.process = function (styles) {
    
            var regexp = /value\((.*?)\)/g, styles;
            var value = regexp.exec(styles);
    
            var replace = {};
    
            while (value) {
    
                var retrieved = retrieve(value[1]);
    
                if (typeof retrieved !== 'string') {
    
                    console.warn(
                        'invalid css value "' + value[1] +
                        '" value, it must be an string and it is ' + typeof retrieved)
    
                }
                else replace[value[0]] = retrieved;
    
                value = regexp.exec(styles);
    
            }
    
            // replace all values with their values
            for (var name in replace) {
    
                var value = replace[name];
                while (styles.indexOf(name) !== -1) {
                    styles = styles.replace(name, value);
                }
    
            }
    
            return styles;
    
        };
    
    };
    
    
    /******************************
    modules/module/styles/styles.js
    ******************************/
    
    var ModuleStyles = function (module) {
        "use strict";
    
        this.push = function (styles, is) {
    
            // process css value
            var values = new Values(module);
            var resources = new Resources(module);
            styles = resources.process(styles);
            styles = values.process(styles);
    
            // append styles into the DOM
            var code = '';
            code += '<style module="' + module.ID + '"';
            code += is ? ' is="' + is + '"' : '';
            code += '>' + styles + '</style>';
    
            $('head').append(code);
    
        };
    
    };
    
    
    /************************************
    modules/module/templates/templates.js
    ************************************/
    
    var ModuleTemplates = function (module) {
    
        var templates = {};
    
        this.register = function (path, template) {
    
            if (templates[path]) {
                console.error('template "' + path + '" is already registered in module "' + module.ID + '"');
            }
    
            templates[path] = template;
    
        };
    
        this.render = function (path, params) {
    
            if (!templates[path]) {
                console.error('invalid template path: "' + path + '"');
                return '';
            }
    
            return templates[path].render(params);
    
        };
    
    };
    
    
    /****************************
    modules/module/rpc/request.js
    ****************************/
    
    var Request = function (module, action, params) {
        "use strict";
    
        var log = localStorage.getItem('log');
        if (log) {
            if (!params) params = {};
            params.log = log;
        }
    
        Object.defineProperty(this, 'action', {
            'get': function () {
                return action;
            }
        });
    
        var serialized = {
            'moduleID': module.ID,
            'action': action,
            'params': params
        };
    
        Object.defineProperty(this, 'params', {
            'get': function () {
                return params;
            }
        });
    
        if (module.ID.substr(0, 10) === 'libraries/') {
            serialized.version = module.library.version;
        }
        else {
            serialized.version = beyond.params.version;
        }
    
        Object.defineProperty(this, 'serialized', {
            'get': function () {
    
                var output = {};
                $.extend(output, serialized, true);
                return output;
    
            }
        });
    
    };
    
    
    /**************************
    modules/module/rpc/cache.js
    **************************/
    
    var Cache = function () {
        "use strict";
    
        // generate the hash
        var hash = function (request) {
    
            var serialized = request.serialized;
            serialized.application = beyond.params.name;
            serialized = JSON.stringify(serialized);
    
            var hash = serialized.split("").reduce(function (a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return Math.abs(a & a);
            }, 0);
    
            hash = 'RPC:' + hash;
    
            return hash;
    
        };
    
        this.read = function (request) {
    
            var key = hash(request);
            return localStorage.getItem(key);
    
        };
    
        this.save = function (request, data) {
    
            data = JSON.stringify({
                'request': request.action,
                'time': Date.now(),
                'value': data
            });
    
            var key = hash(request);
            localStorage.setItem(key, data);
    
        };
    
        this.invalidate = function (request) {
    
            var exists = typeof localStorage.getItem(request.hash) !== 'undefined';
            if (exists) localStorage.removeItem(request.hash);
    
            return exists;
    
        };
    
    };
    
    
    /***************************
    modules/module/rpc/holder.js
    ***************************/
    
    var Holder = function (request, events, callback) {
        "use strict";
    
        var waiting = [];
        var fired;
        var done;
        var canceled;
    
        this.reportError = function (error) {
            canceled = true;
            clearTimeout(timer);
            callback(error);
        };
    
        this.push = function (reason) {
            if (waiting.indexOf(reason) !== -1) return;
            waiting.push(reason);
        };
    
        var timer = setTimeout(function () {
            if (canceled) return;
            console.log('Holder of action "' + request.action + '" is being delayed, still waiting:', waiting);
        }, 5000);
    
        this.cancel = function () {
            canceled = true;
            clearTimeout(timer);
        };
    
        this.done = function () {
    
            if (canceled) return;
    
            done = true;
            if (!waiting.length) {
                clearTimeout(timer);
                fired = true;
                callback();
            }
    
        };
    
        this.release = function (reason) {
    
            if (canceled) return;
    
            if (fired) {
                console.error('Holder already fired');
                return;
            }
    
            var index = waiting.indexOf(reason);
            if (index === -1) {
                console.error('Holder reason "' + reason + '" not set');
                return;
            }
    
            waiting.splice(index, 1);
            if (!waiting.length && done) {
                clearTimeout(timer);
                fired = true;
                callback();
            }
    
        };
    
        events.trigger('execute:before', request, this);
    
        setTimeout(Delegate(this, 'done'), 0);
    
    };
    
    
    /********************************
    modules/module/rpc/action/base.js
    ********************************/
    
    function ActionBase(module, events) {
        "use strict";
    
        var incrementalId = 1;
    
        var ERROR_CODE = Object.freeze({
            'NO_ERROR': 0,
            'SOCKET_ERROR': 1,
            'SOCKET_DISCONNECT': 2,
            'CONNECTION_FAILED': 3,
            'EXECUTION': 4,
            'TIMEOUT': 5,
            'PRE_EXECUTION': 6,
            'CANCELED': 7
        });
    
        var TIMEOUT_REASON = Object.freeze({
            'PRE_EXECUTION': 1,
            'ACKNOWLEDGE': 2,
            'WAITING_RESPONSE': 3
        });
    
        beyond.ACTION_ERROR_CODE = ERROR_CODE;
        beyond.ACTION_TIMEOUT_REASON = TIMEOUT_REASON;
    
        return function (actionPath, params) {
    
            var id = incrementalId;
            Object.defineProperty(this, 'id', {
                'get': function () {
                    return id;
                }
            });
            incrementalId++;
    
            if (!actionPath || typeof actionPath !== 'string') {
                console.error('Invalid action path:', actionPath);
                return;
            }
    
            var request = new Request(module, actionPath, params);
            var holder;
    
            var cache = new Cache();
            this.cache = false;
    
            var timers = {};
            this.holdersTimeout = 20000;
            this.ackTimeout = 2000;
            this.responseTimeout = 5000;
    
            var socket;
    
            var error = ERROR_CODE.NO_ERROR;
            Object.defineProperty(this, 'error', {
                'get': function () {
                    return error;
                }
            });
    
            this.ERROR_CODE = ERROR_CODE;
            this.TIMEOUT_REASON = TIMEOUT_REASON;
    
            var executing;
            Object.defineProperty(this, 'executing', {
                'get': function () {
                    return !!executing;
                }
            });
    
            var executed;
            Object.defineProperty(this, 'executed', {
                'get': function () {
                    return !!executed;
                }
            });
    
            // The acknowledge id received from the server
            var acknowledgeId;
    
            this.getFromCache = function () {
    
                if (!request) {
                    console.error('Request not correctly specified');
                    return;
                }
    
                var cached = cache.read(request);
                if (cached) {
    
                    var item;
                    try {
                        item = JSON.parse(cached);
                    }
                    catch (exc) {
    
                        console.error('error parsing cached item:', cached);
    
                        // remove item to avoid this error on future requests
                        cache.invalidate(request);
    
                        // consider as if cache has never existed, continue and make the RPC request
                        item = undefined;
    
                    }
    
                    return item.value;
    
                }
    
            };
    
            var execute = Delegate(this, function (holderError) {
    
                clearTimeout(timers.holders);
    
                if (holderError) {
    
                    if (!executing) return;
    
                    cancelExecution();
    
                    error = {
                        'code': ERROR_CODE.PRE_EXECUTION,
                        'data': holderError
                    };
    
                    console.error('Holder error', holderError);
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }
                    return;
    
                }
    
                if (typeof this.ackTimeout === 'number') {
    
                    timers.ack = setTimeout(Delegate(this, function () {
    
                        if (!executing) return;
    
                        cancelExecution();
    
                        error = {
                            'code': ERROR_CODE.TIMEOUT,
                            'reason': TIMEOUT_REASON.ACKNOWLEDGE
                        };
    
                        console.error('Acknowledge timeout error on action "' + request.action + '"');
                        if (typeof this.onError === 'function') {
                            this.onError(error);
                        }
    
                    }), this.ackTimeout);
    
                }
    
                socket.emit('rpc', request.serialized, Delegate(this, function (_acknowledgeID) {
    
                    // Action was timed out before the acknowledge arrived
                    clearTimeout(timers.ack);
                    if (!executing) return;
    
                    timers.response = setTimeout(Delegate(this, function () {
    
                        if (!executing) return;
    
                        cancelExecution();
    
                        error = {
                            'code': ERROR_CODE.TIMEOUT,
                            'reason': TIMEOUT_REASON.WAITING_RESPONSE
                        };
    
                        console.error('Timeout error on action "' + request.action + '"');
                        if (typeof this.onError === 'function') {
                            this.onError(error);
                        }
    
                    }), this.responseTimeout);
    
                    if (typeof _acknowledgeID !== 'string' || !_acknowledgeID) {
                        console.error('Invalid acknowledge id.');
                        return;
                    }
    
                    acknowledgeId = _acknowledgeID;
                    if (typeof this.onAcknowledge === 'function') {
                        this.onAcknowledge();
                    }
    
                }));
    
            });
    
            function cancelExecution() {
    
                executing = false;
    
                clearTimeout(timers.holders);
                clearTimeout(timers.ack);
                clearTimeout(timers.response);
    
                if (holder) {
                    holder.cancel();
                }
    
                if (socket) {
                    socket.off('response', onResponse);
                    socket.off('error', onSocketError);
                    socket.off('disconnect', onSocketDisconnect);
                    socket.off('connect_error', onConnectionFailed);
                    socket.off('connect_timeout', onConnectionFailed);
                }
    
            }
    
            this.cancel = function () {
    
                if (!executing) {
                    return;
                }
    
                cancelExecution();
                error = {'code': ERROR_CODE.CANCELED};
                this.onError(error);
    
            };
    
            var onSocketError = Delegate(this, function () {
    
                if (!executing) {
                    return;
                }
    
                cancelExecution();
                error = {'code': ERROR_CODE.SOCKET_ERROR};
                if (typeof this.onError === 'function') {
                    this.onError(error);
                }
    
            });
            var onSocketDisconnect = Delegate(this, function () {
    
                if (!executing) {
                    return;
                }
    
                cancelExecution();
                error = {'code': ERROR_CODE.SOCKET_DISCONNECT};
                if (typeof this.onError === 'function') {
                    this.onError(error);
                }
    
            });
            var onConnectionFailed = Delegate(this, function () {
    
                if (!executing) {
                    return;
                }
    
                cancelExecution();
                error = {'code': ERROR_CODE.CONNECTION_FAILED};
                if (typeof this.onError === 'function') {
                    this.onError(error);
                }
    
            });
    
            var onResponse = Delegate(this, function (response) {
    
                if (typeof response !== 'object' || response === null || !response.id) {
                    console.error('RPC invalid response or invalid response received', response);
                    return;
                }
    
                if (!response.id) {
                    console.error('RPC response id not received', response);
                    return;
                }
    
                // Check if response refers to this action
                if (response.id !== acknowledgeId) return;
                if (!executing) return;
    
                cancelExecution();
                executed = true;
    
                clearTimeout(timers.response);
    
                if (response.error) {
    
                    error = {
                        'code': ERROR_CODE.EXECUTION,
                        'data': response.error
                    };
    
                    console.error('Execution error on action "' + request.action + '".', response.error);
                    if (typeof this.onError === 'function') {
                        this.onError(error);
                    }
                    return;
    
                }
    
                if (this.cache) {
                    cache.save(request, response.message);
                }
    
                if (typeof this.onResponse === 'function') {
                    this.onResponse(response.message);
                }
    
            });
    
            this.execute = function () {
    
                if (executing || executed) {
                    console.error('Action can only be executed once');
                    return;
                }
                executing = true;
    
                if (!request) {
                    console.error('Request not correctly specified');
                    return;
                }
    
                if (this.cache) {
                    var cached = this.getFromCache();
                    if (cached) {
                        if (typeof this.onResponse === 'function') {
                            this.onResponse(cached)
                        }
                        return;
                    }
                }
    
                if (typeof this.holdersTimeout === 'number') {
    
                    timers.holders = setTimeout(Delegate(this, function () {
    
                        if (!executing) {
                            return;
                        }
    
                        cancelExecution();
    
                        error = {
                            'code': ERROR_CODE.TIMEOUT,
                            'reason': TIMEOUT_REASON.PRE_EXECUTION
                        };
                        holder.cancel();
    
                        // At least one RPC holder did not release the implementation of the action.
                        console.error('Holders timeout error on action "' + request.action + '"');
                        if (typeof this.onError === 'function') {
                            this.onError(error);
                        }
    
                    }), this.holdersTimeout);
    
                }
    
                // holder allows hooks to hold the actions to be executed
                // if for some reason, the interceptor interprets that the socket is not ready
                // the interceptor can use the hooker as follows
                //      holder.push('reason');
                //      holder.done('reason');
                // when there are no reasons to hold the execution, then the callback is call
                // and the action is consequently executed
                holder = new Holder(request, events, execute);
                holder.push('socket');
    
                module.socket(function (value) {
    
                    socket = value;
    
                    function onConnect() {
                        holder.release('socket');
                        socket.off('connect', onConnect);
                    }
    
                    if (socket.connected) {
                        holder.release('socket');
                    }
                    else {
                        socket.on('connect', onConnect);
                        socket.connect();
                    }
    
                    socket.on('response', onResponse);
                    socket.on('error', onSocketError);
                    socket.on('disconnect', onSocketDisconnect);
                    socket.on('connect_error', onConnectionFailed);
                    socket.on('connect_timeout', onConnectionFailed);
    
                });
    
            };
    
        }
    
    }
    
    
    /**********************************
    modules/module/rpc/action/action.js
    **********************************/
    
    function Action(module, events) {
        "use strict";
    
        var Base = ActionBase(module, events);
        var POLICY = Object.freeze({
            'ALL_ERRORS': 1,
            'COMMUNICATION_ERRORS': 2,
            'NONE': 3,
            'DEFAULT': 3
        });
        var policy;
    
        return function (actionPath, params) {
    
            var action;
            var promise, resolve, reject;
            var callback;
    
            Object.defineProperty(this, 'POLICY', {
                'get': function () {
                    return POLICY;
                }
            });
            Object.defineProperty(this, 'ERROR_CODE', {
                'get': function () {
                    return beyond.ACTION_ERROR_CODE;
                }
            });
            Object.defineProperty(this, 'TIMEOUT_REASON', {
                'get': function () {
                    return beyond.ACTION_TIMEOUT_REASON;
                }
            });
    
            function release() {
                promise = undefined;
                resolve = undefined;
                reject = undefined;
                action = undefined;
                executed = true;
                executing = false;
            }
    
            var execute = Delegate(this, function () {
    
                action = new Base(actionPath, params);
                action.onResponse = Delegate(this, function (response) {
    
                    var _resolve = resolve;
                    release();
                    if (_resolve) {
                        _resolve(response);
                    }
                    if (typeof this.onResponse === 'function') {
                        this.onResponse(response);
                    }
                    if (callback) {
                        callback(response);
                    }
    
                });
                action.onError = Delegate(this, function (error) {
    
                    var ERROR = action.ERROR_CODE;
    
                    if (error.code === ERROR.CANCELED) {
                        release();
                        if (typeof this.onError === 'function') {
                            this.onError(error);
                        }
                        if (callback) {
                            callback(undefined, error);
                        }
                        return;
                    }
    
                    var communicationErrors = [
                        ERROR.SOCKET_ERROR,
                        ERROR.SOCKET_DISCONNECT,
                        ERROR.CONNECTION_FAILED,
                        ERROR.TIMEOUT,
                        ERROR.PRE_EXECUTION
                    ];
                    if (policy === POLICY.ALL_ERRORS ||
                        (policy === POLICY.COMMUNICATION_ERRORS &&
                        communicationErrors.indexOf(error.code) !== -1)) {
    
                        beyond.showConnectionError(execute);
    
                    }
                    else {
                        var _reject = reject;
                        release();
                        if (_reject) {
                            _reject(error);
                        }
                        if (typeof this.onError === 'function') {
                            this.onError(error);
                        }
                        if (callback) {
                            callback(undefined, error);
                        }
                    }
    
                });
    
                if (this.holdersTimeout) action.holdersTimeout = this.holdersTimeout;
                if (this.ackTimeout) action.ackTimeout = this.ackTimeout;
                if (this.responseTimeout) action.responseTimeout = this.responseTimeout;
                if (this.cache) action.cache = this.cache;
    
                action.execute();
    
            });
    
            var executed, executing;
            Object.defineProperty(this, 'executing', {
                'get': function () {
                    return !!executing;
                }
            });
            Object.defineProperty(this, 'executed', {
                'get': function () {
                    return !!executed;
                }
            });
            this.execute = function (specs) {
    
                if (!specs) {
                    specs = {};
                }
                if (typeof specs !== 'object') {
                    throw new Error('Invalid parameters');
                }
    
                policy = (!specs.policy) ? POLICY.DEFAULT : specs.policy;
    
                if (executed || executing) {
                    console.error('Action can only be executed once');
                    return;
                }
                executing = true;
    
                if (typeof specs.callback === 'function') {
                    callback = specs.callback;
                }
    
                if (specs.promise) {
    
                    promise = new Promise(function (_resolve, _reject) {
                        resolve = _resolve;
                        reject = _reject;
                    });
    
                    execute();
    
                    return {
                        'promise': promise,
                        'cancel': Delegate(this, 'cancel')
                    };
    
                }
                else {
                    execute();
                }
    
            };
            this.cancel = function () {
    
                if (!executing) {
                    console.error('Action is not being executed', actionPath, params);
                    return;
                }
                action.cancel();
    
            };
    
        };
    
    }
    
    
    /************************
    modules/module/plugins.js
    ************************/
    
    var Plugins = function (module) {
        "use strict";
    
        var plugins = {};
    
        var order;
        Object.defineProperty(this, 'order', {
            'get': function () {
                return order;
            },
            'set': function (value) {
                order = value;
            }
        });
    
        this.register = function (ID, plugin, group) {
    
            if (!group) group = 'default';
            if (!plugins[group]) plugins[group] = {};
    
            plugins[group][ID] = plugin;
    
        };
    
        this.get = function (group) {
    
            if (!group) group = 'default';
            var group = plugins[group];
    
            var ordered = [];
            for (var i in order) {
    
                var name = order[i];
                if (group[name]) ordered.push(group[name]);
    
            }
    
            // set all the plugins not in the ordered list
            for (var name in group) {
    
                if (!order || order.indexOf(name) === -1) ordered.push(group[name]);
    
            }
    
            return ordered;
    
        };
    
    };
    
    
    /****************************
    modules/module/texts/texts.js
    ****************************/
    
    var Texts = function (module) {
        "use strict";
    
        this.copy = function () {
    
            var texts = {};
            $.extend(true, texts, this);
    
            delete texts.copy;
            return texts;
    
        };
    
    };
    
    
    /**********************
    modules/module/react.js
    **********************/
    
    function ReactRegister(module, events) {
        "use strict";
    
        // jsx register functions that creates the React elements
        // this is done this way because React.createElement cannot be called until
        // React is loaded by requirejs
        var registeredFunctions = {};
    
        var React, ReactDOM;
    
        var items = {};
        Object.defineProperty(this, 'items', {
            'get': function () {
                return items;
            }
        });
    
        var ready;
        var loading;
        Object.defineProperty(this, 'loading', {
            'get': function () {
                return loading;
            }
        });
    
        var loadDependencies = function () {
    
            require(['react', 'react-dom'], function (_React, _ReactDOM) {
    
                React = _React;
                ReactDOM = _ReactDOM;
    
                module.React = React;
                module.ReactDOM = ReactDOM;
    
                for (var key in registeredFunctions) {
                    items[key] = registeredFunctions[key]();
                }
    
                loading = false;
                ready = true;
    
                for (var i in callbacks) {
                    callbacks[i]();
                }
                callbacks = [];
    
                events.trigger('react:ready');
    
            });
    
        };
    
        var checkDependencies = function () {
    
            if (ready || loading) {
                return;
            }
    
            loading = true;
    
            // the timeout is to avoid MISMATCHED ANONYMOUS DEFINE (requirejs)
            setTimeout(loadDependencies, 0);
    
        };
    
        this.register = function (key, createElementFnc) {
    
            checkDependencies();
    
            if (!ready) {
                registeredFunctions[key] = createElementFnc;
                return;
            }
    
            items[key] = createElementFnc();
    
        };
    
        var callbacks = [];
        this.done = function (callback) {
    
            if (ready) {
                callback();
                return;
            }
    
            callbacks.push(callback);
    
        };
    
        this.createControl = function (specs) {
            "use strict";
    
            if (!React) {
                console.error('Wait for React to be ready');
                return;
            }
    
            if (!specs || typeof specs.render !== 'function') {
                console.warn('Invalid control specification');
            }
    
            return React.createClass({
    
                'getInitialState': function () {
    
                    if (typeof this.props.sna !== 'object') {
                        console.warn('sna is invalid or not set');
                        return null;
                    }
    
                    this.sna = this.props.sna;
                    this.extended = this.props.extended;
    
                    if (typeof this.sna.actions !== 'object') {
                        console.warn('sna actions are invalid or not defined');
                    }
                    else {
                        this.actions = this.sna.actions;
                    }
    
                    if (typeof this.sna.state !== 'object') {
                        console.warn('sna state is invalid or not defined');
                        return null;
                    }
    
                    return this.sna.state;
    
                },
                '_onChange': function () {
    
                    if (typeof this.sna.state !== 'object') {
                        console.warn('sna state is invalid or not defined');
                        return null;
                    }
    
                    if (typeof this.sna.actions !== 'object') {
                        console.warn('sna actions are invalid or not defined');
                    }
                    else {
                        this.actions = this.sna.actions;
                    }
    
                    this.setState(this.sna.state);
    
                },
                'componentDidMount': function () {
    
                    if (!this.sna || !this.sna.bind) return;
                    this.sna.bind('change', this._onChange);
    
                    if (!specs || !specs.componentDidMount) return null;
                    return specs.componentDidMount.call(this, specs);
    
                },
                'componentWillUnmount': function () {
    
                    if (!this.sna || !this.sna.unbind) return;
                    this.sna.unbind('change', this._onChange);
    
                    if (!specs || !specs.componentWillUnmount) return null;
                    return specs.componentWillUnmount.call(this, specs);
    
                },
                'componentWillUpdate': function () {
    
                    if (!specs || !specs.componentWillUpdate) return null;
                    return specs.componentWillUpdate.call(this, specs);
    
                },
                'componentDidUpdate': function () {
    
                    if (!specs || !specs.componentDidUpdate) return null;
                    return specs.componentDidUpdate.call(this, specs);
    
                },
                'render': function () {
    
                    if (!specs || !specs.render) return null;
    
                    specs.extended = this.props.extended;
                    return specs.render.call(specs, this.state, this.actions, this);
    
                }
    
            });
    
        }
    
    }
    
    
    /*****************************
    modules/module/dependencies.js
    *****************************/
    
    function Dependencies(module, dependencies) {
        "use strict";
    
        var modules = {};
        Object.defineProperty(this, 'modules', {
            'get': function () {
                return modules;
            }
        });
    
        this.set = function (value) {
    
            if (dependencies) {
                console.error('Module dependencies can only be set once')
                return;
            }
            dependencies = value;
            load();
    
        };
    
        var ready;
        Object.defineProperty(this, 'loaded', {
            'get': function () {
                return !!ready;
            }
        });
    
        var callbacks = [];
    
        function done() {
    
            ready = true;
            for (var i in callbacks) {
                callbacks[i](modules);
            }
            callbacks = [];
    
        }
    
        this.done = function (callback) {
    
            if (ready) {
                callback(modules);
                return;
            }
            callbacks.push(callback);
    
        };
    
        var coordinate = new Coordinate(
            'controls',
            'require',
            'react',
            done);
    
        function getResourcePath(resource) {
    
            if (resource.substr(0, 12) === 'application/') {
                return 'application/' + resource.substr(12);
            }
    
            if (resource.substr(0, 10) !== 'libraries/') {
                return resource;
            }
    
            var type;
    
            // Extract the type of the resource to get the moduleID
            var moduleID = (function (resource) {
    
                resource = resource.split('/');
                type = resource.pop();
                return resource.join('/');
    
            })(resource);
    
            var multilanguage = beyond.modules.multilanguage.get(moduleID);
            if (multilanguage && multilanguage.indexOf(type) !== -1) {
                return resource + '/' + beyond.params.language;
            }
            else {
                return resource;
            }
    
        }
    
        function load() {
    
            var mods = [];
    
            var dependency;
            for (var resource in dependencies.require) {
                mods.push(getResourcePath(resource));
            }
    
            // Wait for react to be ready if react is on the dependencies list
            if (mods.indexOf('react') !== -1) {
                module.react.done(coordinate.react);
            }
            else {
                coordinate.done('react');
            }
    
            if (mods.length) {
    
                require(mods, function () {
    
                    var args = [].slice.call(arguments);
    
                    var i = 0;
                    for (dependency in dependencies.require) {
    
                        var name = dependencies.require[dependency];
                        modules[name] = args[i];
                        i++;
    
                    }
    
                    coordinate.done('require');
    
                });
    
            }
            else {
                coordinate.done('require');
            }
    
            if (dependencies.controls instanceof Array && dependencies.controls.length) {
                beyond.controls.import(dependencies.controls, coordinate.controls);
            }
            else {
                coordinate.done('controls');
            }
    
        }
    
        if (dependencies) load();
    
    }
    
    
    /*********************************
    modules/module/control/behavior.js
    *********************************/
    
    function Behavior(module, specs) {
        "use strict";
    
        if (typeof specs !== 'object') {
            console.error('Invalid specification', specs);
            throw new Error('Invalid control specifications');
        }
        if (typeof specs.react !== 'string' && (
            typeof specs.react !== 'object' ||
            (typeof specs.react.control !== 'string' && typeof specs.react.control !== 'function'))) {
            console.error('Invalid react specification', specs);
            throw new Error('Invalid react specification');
        }
        if (typeof specs.sna !== 'function') {
            console.error('Invalid sna specification', specs);
            throw new Error('Invalid sna specification');
        }
    
        var ready;
        // Do not use ready as this.ready is reserved to polymer
        Object.defineProperty(this, 'isReady', {
            'get': function () {
                return !!ready;
            }
        });
    
        function onDependenciesReady() {
    
            var dependencies = module.dependencies.modules;
    
            var sna = specs.sna(dependencies);
    
            // Check for already set properties
            for (var name in specs.properties) {
                var spec = specs.properties[name];
                if (spec.observer && this[name]) {
    
                    if (!sna[spec.observer]) {
                        console.error('sna must implement observer function "' + spec.observer +
                            '" as is declared in the property "' + name + '"');
                        continue;
                    }
                    sna[spec.observer](this[name]);
    
                }
            }
    
            this._setSNA(sna);
    
            var react = {};
            if (typeof specs.react === 'string') {
                react.item = module.react.items[specs.react];
                react.properties = {'sna': sna};
            }
            else {
    
                if (typeof specs.react.control === 'string') {
                    react.item = module.react.items[specs.react.control];
                }
                else {
                    react.item = specs.react.control;
                }
    
                if (typeof specs.react.properties === 'object') {
                    react.properties = specs.react.properties;
                }
                else if (typeof specs.react.properties === 'function') {
                    react.properties = specs.react.properties();
                }
    
                if (typeof react.properties !== 'object') {
                    react.properties = {};
                }
    
                react.properties.sna = sna;
    
            }
    
            if (!react.item) {
                console.error('Invalid react item, check specification', specs);
                throw new Error('Invalid react item');
            }
    
            var ReactDOM = dependencies.ReactDOM;
    
            react.element = module.React.createElement(react.item, react.properties);
            ReactDOM.render(react.element, this);
    
            ready = true;
            for (var i in callbacks) {
                callbacks[i]();
            }
            callbacks = undefined;
            this.fire('ready');
    
        }
    
        var callbacks = [];
        this.done = function (callback) {
    
            if (ready) {
                callback();
                return;
            }
    
            callbacks.push(callback);
    
        };
    
        /**
         * Polymer method executed when properties are set and local DOM is initialized.
         */
        this.ready = function () {
    
            var coordinate = new Coordinate(
                'dependencies',
                'react',
                Delegate(this, onDependenciesReady));
    
            module.dependencies.done(coordinate.dependencies);
            module.react.done(coordinate.react);
    
        };
    
        this._onSNAChanged = function () {
    
            var sna = this._sna;
            if (!sna.state) {
                return;
            }
    
            for (var name in specs.properties) {
    
                var spec = specs.properties[name];
                if (spec.stateSource) {
    
                    var value = sna.state[spec.stateSource];
    
                    if (value === this[name]) {
                        continue;
                    }
    
                    if (spec.readOnly) {
    
                        var method = '_set' +
                            name.substr(0, 1).toUpperCase() +
                            name.substr(1);
    
                        this[method](value);
    
                    }
                    else {
                        this[name] = value;
                    }
    
                }
    
            }
    
        };
    
        this._setSNA = function (value) {
    
            if (this._sna) {
                throw new Error('sna is already defined');
            }
            this._sna = value;
    
            this._sna.bind('change', Delegate(this, this._onSNAChanged));
            this._onSNAChanged();
    
        };
    
        var setObserver = Delegate(this, function (name, property, observer) {
    
            var method = '_set' + name.substr(0, 1).toUpperCase() + name.substr(1) + 'Changed';
            property.observer = method;
    
            // Executed when property changed
            this[method] = function (value) {
    
                if (!this._sna) {
                    return;
                }
    
                if (typeof this._sna[observer] !== 'function') {
                    console.error('sna must implement observer function "' + observer +
                        '" as is declared in the property "' + name + '"');
                    return;
                }
    
                this._sna[observer](value);
    
            };
    
        });
    
        this.properties = {};
        for (var name in specs.properties) {
    
            var spec = specs.properties[name];
            var property = {};
    
            if (!spec.stateSource) {
                console.error('Property "' + name + '" does not specify the stateSource attribute');
                continue;
            }
    
            if (spec.type) {
                property.type = spec.type;
            }
    
            if (spec.observer) {
                setObserver(name, property, spec.observer);
            }
    
            spec.readOnly = !spec.observer;
            property.readOnly = spec.readOnly;
    
            property.notify = !!spec.notify;
    
            this.properties[name] = property;
    
        }
    
        function onMethodExecuted(name) {
    
            if (!this._sna) {
                throw new Error('sna not set, wait for control to be ready');
            }
    
            if (typeof this._sna[name] !== 'function') {
                throw new Error('sna must implement method "' + name + '"');
            }
    
            var args = [].slice.call(arguments);
            args.shift();
    
            return this._sna[name].apply(this._sna, args);
    
        }
    
        for (var index in specs.methods) {
    
            var method = specs.methods[index];
            (function (behavior, method) {
    
                behavior[method] = function () {
    
                    var args = [].slice.call(arguments);
                    args.unshift(method);
                    return onMethodExecuted.apply(this, args);
    
                };
    
            })(this, method);
    
        }
    
    }
    
    
    /********************************
    modules/module/control/control.js
    ********************************/
    
    function Control(module) {
        "use strict";
    
        var id;
        Object.defineProperty(this, 'id', {
            'get': function () {
                return id;
            },
            'set': function (value) {
                if (id) {
                    throw new Error('Attribute "id" is read only');
                }
                id = value;
            }
        });
    
        var defined;
        this.define = function (specs) {
            "use strict";
    
            if (!id) {
                throw new Error('Control id was not specified, check the module.json file');
            }
            if (typeof specs !== 'object') {
                throw new Error('Invalid parameters');
            }
    
            if (defined) {
                throw new Error('Control already defined');
            }
            defined = true;
    
            var behavior = new Behavior(module, specs);
            Polymer({'is': id, 'behaviors': [behavior]});
    
        };
    
    }
    
    
    /***********************
    modules/module/module.js
    ***********************/
    
    var Module = function (ID, events) {
        "use strict";
    
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });
    
        var library;
        (function (ID) {
    
            ID = ID.split('/');
            if (ID[0] === 'libraries') {
                library = beyond.libraries.get(ID[1]);
            }
    
        })(ID);
        Object.defineProperty(this, 'library', {
            'get': function () {
                return library;
            }
        });
    
        var path = ID;
        if (library && path === library.path) {
            path = path + '/main';
        }
    
        path = path.split('/');
        if (library) {
            // Remove /libraries/library
            path.splice(0, 2);
        }
        else {
            // Remove /application
            path.splice(0, 1);
        }
    
        path = path.join('/');
    
        Object.defineProperty(this, 'path', {
            'get': function () {
                return path;
            }
        });
    
        var host;
        if (library) {
            host = beyond.hosts.libraries[library.name].js;
        }
        else {
            host = beyond.hosts.application.js;
        }
        host += path;
        Object.defineProperty(this, 'host', {
            'get': function () {
                return host;
            }
        });
    
        var plugins = new Plugins(this);
        Object.defineProperty(this, 'plugins', {
            'get': function () {
                return plugins;
            }
        });
    
        var texts = new Texts(this);
        Object.defineProperty(this, 'texts', {
            'get': function () {
                return texts;
            }
        });
    
        this.react = new ReactRegister(this, events);
    
        this.control = new Control(this);
    
        var dependencies = new Dependencies(this);
        this.dependencies = dependencies;
    
        this.Action = Action(this, events);
    
        this.invalidateCache = function (actionPath, params) {
    
            var request = new Request(this, actionPath, params);
            var cache = new Cache();
    
            return cache.invalidate(request);
    
        };
    
        this.execute = function () {
    
            var args = [].slice.call(arguments);
    
            // options must be after callback
            var actionPath, params, callback, options;
    
            for (var i in args) {
    
                var arg = args[i];
                switch (typeof arg) {
                    case 'string':
                        actionPath = arg;
                        break;
                    case 'function':
                        callback = arg;
                        break;
                    case 'object':
                        if (callback) options = arg;
                        else params = arg;
                }
    
            }
    
            if (typeof params === 'function' && typeof callback === 'undefined') {
                callback = params;
                params = undefined;
            }
    
            var action = new this.Action(actionPath, params);
            action.onResponse = function (response) {
                if (callback) callback(response);
            };
            action.onError = function (error) {
                if (callback) callback(undefined, error);
            };
            action.execute();
    
        };
    
        var styles = new ModuleStyles(this);
        Object.defineProperty(this, 'styles', {
            'get': function () {
                return styles;
            }
        });
    
        Object.defineProperty(this, 'css', {
            'get': function () {
                return styles;
            }
        });
    
        var templates = new ModuleTemplates(this);
        Object.defineProperty(this, 'templates', {
            'get': function () {
                return templates;
            }
        });
    
        this.render = function (path, params) {
            return templates.render(path, params);
        };
    
        Object.defineProperty(this, 'custom', {
            'get': function () {
    
                if (!library) {
                    return;
                }
    
                var custom = 'application/custom/' + library.name + '/' + this.path;
                return custom;
    
            }
        });
    
        this.socket = function (callback) {
    
            if (this.ID.substr(0, 10) === 'libraries/') {
    
                if (!library.socket) {
                    console.error('library does not support server communication', library.name);
                    return;
                }
                library.socket(function (socket) {
                    callback(socket);
                });
    
            }
            else {
    
                beyond.socket(function (socket) {
                    callback(socket);
                });
    
            }
    
        };
    
        var ready;
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return !!ready;
            }
        });
    
        var callbacks = [];
        this.done = function (callback) {
    
            if (ready) {
                callback(dependencies.modules);
                return;
            }
    
            callbacks.push(callback);
    
        };
    
        this.dependencies.done(function () {
    
            ready = true;
    
            for (var i in callbacks) {
                callbacks[i](dependencies.modules);
            }
            callbacks = undefined;
    
        });
    
    };
    
    
    /*****************
    modules/modules.js
    *****************/
    
    var Modules = function (events) {
        "use strict";
    
        var loaded = {};
        this.loaded = loaded;
    
        var items = {};
        var keys = [];
        Object.defineProperty(this, 'items', {
            'get': function () {
                return items;
            }
        });
        Object.defineProperty(this, 'keys', {
            'get': function () {
                return keys;
            }
        });
        Object.defineProperty(this, 'length', {
            'get': function () {
                return keys.length;
            }
        });
    
        // List of modules that are multilanguage
        var multilanguage = new Map();
        Object.defineProperty(this, 'multilanguage', {
            'get': function () {
                return multilanguage;
            }
        });
    
        this.get = function (moduleID, extendedID) {
    
            var done = function () {
    
                events.trigger(moduleID + ':done');
                events.trigger('done', moduleID);
    
                loaded[moduleID] = true;
    
            };
    
            var extended;
            if (extendedID) {
                extended = items[extendedID];
                if (!extended) {
                    extended = new Module(moduleID, events);
                    items[extendedID] = extended;
                    keys.push(extendedID);
                }
            }
    
            var module = items[moduleID];
            if (!module) {
                module = new Module(moduleID, events);
                items[moduleID] = module;
                keys.push(moduleID);
            }
    
    
            if (extended) return [module, extended];
            else return [module, done];
    
        };
    
    };
    
    
    /*********************
    requireConfig/error.js
    *********************/
    
    var onError = function (events) {
        "use strict";
    
        requirejs.onError = function (err) {
    
            if (err.requireType === 'timeout') {
    
                events.trigger('error');
                for (var i in err.requireModules) {
                    requirejs.undef(err.requireModules[i]);
                }
    
                // try again loading modules
                require(err.requireModules, function () {
                    events.trigger('retried');
                });
    
            }
            else {
                console.log(err.stack);
            }
    
        };
    
    };
    
    
    /**********************
    requireConfig/config.js
    **********************/
    
    var RequireConfig = function (events) {
        "use strict";
    
        onError(events);
    
        // register the paths of the imported libraries by the application
        var hosts = beyond.hosts;
        var paths = {};
        var host;
    
        if (hosts.application && typeof hosts.application.js === 'string') {
    
            if (location.protocol === 'file:') {
                host = hosts.application.js;
                if (!host) {
                    host = '.';
                }
            }
            else {
                host = location.origin + hosts.application.js;
            }
    
            // Remove the last '/' of the host
            if (host.substr(host.length - 1) === '/') {
                host = host.substr(0, host.length - 1);
            }
    
            paths.application = host;
    
        }
    
        for (var name in hosts.libraries) {
    
            var library = hosts.libraries[name];
    
            if (location.protocol === 'file:') {
                host = library.js;
            }
            else {
                host = location.origin;
                host += (library.js.substr(0, 1) !== '/') ? '/' : '';
                host += library.js;
            }
    
            // Remove the last '/' of the host
            if (host.substr(host.length - 1) === '/') {
                host = host.substr(0, host.length - 1);
            }
    
            paths['libraries/' + name] = host;
    
        }
    
        requirejs.config({'paths': paths});
    
        Object.defineProperty(this, 'paths', {
            'get': function () {
                return requirejs.s.contexts._.config.paths;
            }
        });
    
    };
    
    
    /******
    logs.js
    ******/
    
    function Logs(beyond) {
        "use strict";
    
        var style = 'style="';
        style += 'position: absolute;';
        style += 'bottom: 40px; left: 10px; right: 10px;';
        style += 'z-index: 10000;';
        style += 'background: #c7c7c7;';
        style += 'border: 1px solid #333;';
        style += 'padding: 5px;';
        style += 'border-radius: 3px';
        style += 'color: white;';
        style += '"';
    
        var $log = $('<div ' + style + ' />')
            .addClass('log')
            .hide();
    
        $('body').append($log);
    
        this.append = function (msg) {
    
            var $msg = $('<div />').html(msg);
            $log.append($msg);
    
            if (beyond.params.showLogs) {
                this.show();
            }
    
        };
    
        var timer;
        this.show = function () {
    
            $log.show();
    
            clearTimeout(timer);
            timer = setTimeout(Delegate(this, function () {
                this.hide();
            }), 5000);
    
        };
    
        this.hide = function () {
            $log.hide();
        };
    
        if (beyond.params.showLogs) {
            window.onError = function (message, url, line) {
                beyond.logs.append(message + ' - ' + url + ' - on line: ' + line);
            };
        }
    
    }
    
    
    /*******
    ready.js
    *******/
    
    /**
     * Beyond is ready when the start code was completely executed
     * and when the events WebComponentsReady is triggered, required to process polymer components
     *
     * @param beyond
     * @param events
     */
    var exposeReady = function (beyond, events) {
    
        var ready;
        Object.defineProperty(beyond, 'ready', {
            'get': function () {
                return ready;
            }
        });
    
        var callbacks = [];
    
        var coordinate = new Coordinate('webComponentsReady', 'startCode', function () {
    
            ready = true;
            events.trigger('ready');
    
            for (var i in callbacks) {
                callbacks[i]();
            }
            callbacks = [];
    
        });
    
        var onStart = function () {
    
            events.unbind('start', onStart);
            coordinate.done('startCode');
    
        };
    
        events.bind('start', onStart);
    
        // Sometimes WebComponentsReady event is not triggered
        var timer;
        window.addEventListener('WebComponentsReady', function () {
    
            clearInterval(timer);
            timer = undefined;
            coordinate.done('webComponentsReady');
    
        });
        timer = setInterval(function () {
    
            if (!window.Polymer || !window.Polymer.Base ||
                typeof window.Polymer.Base.importHref !== 'function') {
    
                return;
            }
    
            clearInterval(timer);
            coordinate.done('webComponentsReady');
    
        }, 200);
    
        beyond.done = function (callback) {
    
            if (ready) {
                callback();
                return;
            }
    
            callbacks.push(callback);
    
        };
    
    };
    
    
    /****************
    toast/messages.js
    ****************/
    
    function Messages() {
        "use strict";
    
        var map = new Map();
        var ordered = [];
    
        Object.defineProperty(this, 'keys', {
            'get': function () {
                return ordered.slice();
            }
        });
    
        this.set = function (message) {
    
            if (typeof message !== 'object') {
                console.log(message);
                throw new Error('Message parameter is invalid');
            }
    
            var id = message.id;
            if (typeof id !== 'string') {
                console.log(message);
                throw new Error('Invalid message id');
            }
    
            map.set(id, message);
    
            var index = ordered.indexOf(id);
            if (index !== -1) {
                ordered.splice(index, 1);
            }
    
            ordered.push(id);
    
        };
    
        this.get = function (id) {
    
            return map.get(id);
    
        };
    
        this.typeExists = function (type) {
    
            var exists = false;
            map.forEach(function (message) {
                if (exists) {
                    return;
                }
                if (message.type === type) {
                    exists = true;
                }
            });
    
            return exists;
    
        };
    
        this.delete = function (message) {
    
            var id = (typeof message === 'object') ? message.id : message;
            if (typeof id !== 'string') {
                throw new Error('Message id is invalid');
            }
    
            map.delete(id);
    
            var index = ordered.indexOf(id);
            if (index !== -1) {
                ordered.splice(index, 1);
            }
    
        };
    
        Object.defineProperty(this, 'first', {
            'get': function () {
                return map.get(ordered[0]);
            }
        });
    
    }
    
    
    /*************
    toast/toast.js
    *************/
    
    function Toast(beyond) {
        "use strict";
    
        var events = new Events({'bind': this});
    
        var MESSAGE_TYPE = Object.freeze({
            'GENERAL_MESSAGE': 1,
            'GENERAL_ERROR': 2,
            'CONNECTION_ERROR': 3,
            'WARNING': 4
        });
        Object.defineProperty(this, 'MESSAGE_TYPE', {
            'get': function () {
                return MESSAGE_TYPE;
            }
        });
    
        const DURATION_DEFAULT = 3000;
        var messages = new Messages();
    
        var autoincrement = 0;
    
        beyond.showMessage = function (specs, duration) {
    
            // Check parameters
            if (typeof specs === 'string') {
                specs = {
                    'text': specs,
                    'duration': duration
                }
            }
            if (typeof specs !== 'object') {
                throw new Error('Invalid parameters');
            }
            if (!specs.type) {
                specs.type = MESSAGE_TYPE.GENERAL_MESSAGE;
            }
            if (specs.retry && typeof specs.retry !== 'function') {
                throw new Error('Invalid parameters, retry must be a function');
            }
    
            var id = specs.id;
            if (!id) {
                autoincrement++;
                id = 'message-' + autoincrement;
            }
    
            if (specs.type === MESSAGE_TYPE.CONNECTION_ERROR) {
    
                if (!specs.retry) {
                    throw new Error('Invalid parameters, retry was expected');
                }
    
                messages.set({
                    'id': id,
                    'type': MESSAGE_TYPE.CONNECTION_ERROR,
                    'retry': specs.retry,
                    'duration': 0 // Infinity
                });
    
            }
            else if (specs.type === MESSAGE_TYPE.GENERAL_ERROR) {
    
                if (!specs.text) {
                    throw new Error('Invalid parameters, text was expected');
                }
    
                if (specs.retry) {
                    duration = 0; // Infinity
                }
                else if (typeof specs.duration === 'number') {
                    duration = specs.duration;
                }
                else {
                    duration = DURATION_DEFAULT;
                }
    
                messages.set({
                    'id': id,
                    'type': MESSAGE_TYPE.GENERAL_ERROR,
                    'text': specs.text,
                    'retry': specs.retry,
                    'duration': duration
                });
    
            }
            else if (specs.type === MESSAGE_TYPE.GENERAL_MESSAGE) {
    
                if (!specs.text) {
                    throw new Error('Invalid parameters, text was expected');
                }
    
                messages.set({
                    'id': id,
                    'type': MESSAGE_TYPE.GENERAL_MESSAGE,
                    'text': specs.text,
                    'close': !!specs.close,
                    'duration': (typeof specs.duration === 'number') ? specs.duration : DURATION_DEFAULT
                });
    
            }
            else if (specs.type === MESSAGE_TYPE.WARNING) {
    
                if (!specs.text) {
                    throw new Error('Invalid parameters, message was expected');
                }
    
                messages.set({
                    'id': id,
                    'type': MESSAGE_TYPE.WARNING,
                    'text': specs.text,
                    'close': !!specs.close,
                    'duration': (typeof specs.duration === 'number') ? specs.duration : DURATION_DEFAULT
                });
    
            }
            else {
                throw new Error('Invalid parameters, message type is invalid')
            }
    
            events.trigger('change');
            return id;
    
        };
    
        beyond.showConnectionError = function (callback) {
            return beyond.showMessage({
                'type': MESSAGE_TYPE.CONNECTION_ERROR,
                'retry': callback
            });
        };
        beyond.showWarning = function (text, duration) {
            return beyond.showMessage({
                'type': MESSAGE_TYPE.WARNING,
                'text': text,
                'duration': duration
            });
        };
    
        this.removeMessage = function (id) {
            messages.delete(id);
            events.trigger('change');
        };
    
        beyond.removeMessage = this.removeMessage;
    
        this.retry = function () {
    
            var message = this.message;
            if (!message) {
                console.error('Retry method was called, but there is no active message');
                return;
            }
    
            if (message.type === MESSAGE_TYPE.CONNECTION_ERROR) {
    
                var remove = [];
                for (var index in messages.keys) {
    
                    var id = messages.keys[index];
    
                    message = messages.get(id);
                    if (message.type === MESSAGE_TYPE.CONNECTION_ERROR) {
                        message.retry();
                        remove.push(id);
                    }
    
                }
    
                for (var index in remove) {
                    var id = remove[index];
                    messages.delete(id);
                }
    
            }
            else {
    
                if (typeof message.retry !== 'function') {
                    console.error('Message retry function not set');
                }
                else {
                    message.retry();
                }
    
                messages.delete(message);
    
            }
    
            setTimeout(function () {
                events.trigger('change');
            }, 500)
    
    
        };
    
        this.close = function () {
    
            var message = this.message;
            if (!message) {
                return;
            }
    
            if (message.type === MESSAGE_TYPE.CONNECTION_ERROR) {
                console.error('Connection error message type cannot be closed', message);
                return;
            }
    
            messages.delete(message);
            events.trigger('change');
    
        };
    
        Object.defineProperty(this, 'message', {
            'get': function () {
    
                if (messages.typeExists(MESSAGE_TYPE.CONNECTION_ERROR)) {
                    return {
                        'type': MESSAGE_TYPE.CONNECTION_ERROR
                    }
                }
    
                return messages.first;
            }
        });
    
    }
    
    
    /********
    beyond.js
    ********/
    
    var Beyond = function (beyond) {
        "use strict";
    
        if (!beyond) {
            console.error('invalid configuration, beyond variable is undefined');
            return;
        }
    
        var events = new Events({'bind': this});
    
        var dispatcher = new Events();
        this.register = function (event, listener, priority) {
            return dispatcher.bind(event, listener, priority);
        };
        this.unregister = function (event, listener) {
            return dispatcher.unbind(event, listener);
        };
        this.dispatch = function () {
            return dispatcher.trigger.apply(dispatcher, arguments);
        };
    
        if (!beyond.css) beyond.css = {};
    
        this.hosts = beyond.hosts;
        this.params = beyond.params;
        this.css = {'values': beyond.css.values};
        this.overwrites = beyond.overwrites;
    
        this.requireConfig = new RequireConfig(events);
    
        this.sockets = new Sockets();
    
        this.libraries = new Libraries(this);
        this.modules = new Modules(events);
        this.Module = Module;
    
        this.logs = new Logs(this);
    
        // beyond.toasts works together with the ui/toast module
        this.toast = new Toast(this);
    
        exposeReady(this, events);
    
        this.pages = new Pages(events);
        this.navigation = new Navigation(this, this.pages, events);
        Object.defineProperty(this, 'pathname', {
            'get': function () {
                return this.navigation.pathname;
            }
        });
    
        this.navigate = function () {
            this.navigation.navigate.apply(this.navigation, arguments);
        };
    
        this.registerError = function () {
            this.errorHandler.registerError.apply(this.errorHandler, arguments);
        };
    
        this.start = function () {
    
            var appHost = this.hosts.application.ws;
            if (appHost) {
                exportSocket(this, this, appHost);
            }
    
            if (!$('body > .app-container').length) {
                console.error('body > .app-container does not exist');
            }
    
            events.trigger('start');
            delete this.start;
    
        };
    
    };
    
    if (typeof beyond !== 'object') {
        console.error('beyond configuration not set. Check if the script config.js is in your index.html and it must be before the beyond.js library.');
    }
    else {
        window.beyond = new Beyond(beyond);
    }
    
    
    /*******************
    phonegap/phonegap.js
    *******************/
    
    var Phonegap = function () {
        "use strict";
    
        Object.defineProperty(this, 'isPhonegap', {
            'get': function () {
    
                return (!!window.cordova || !!window.PhoneGap || !!window.phonegap)
                    && /^file:\/{3}[^\/]/i.test(window.location.href)
                    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    
            }
        });
    
        var ready;
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return ready;
            }
        });
    
        var callbacks = [];
    
        function onDeviceReady() {
    
            ready = true;
            for (var i in callbacks) {
                try {
                    callbacks[i]();
                }
                catch (exc) {
                    console.log(exc);
                }
            }
    
            callbacks = [];
    
        }
    
        document.addEventListener('deviceready', onDeviceReady);
    
        this.done = function (callback) {
    
            if (typeof callback !== 'function') {
                console.error('Invalid callback function.');
                return;
            }
    
            if (ready) {
                callback();
            }
            else {
                callbacks.push(callback);
            }
    
        };
    
    };
    
    window.beyond.phonegap = new Phonegap();
    
    
    /***************
    phonegap/push.js
    ***************/
    
    function Push(phonegap) {
        "use strict";
    
        var events = new Events({'bind': this});
    
        var push;
    
        var registrationId;
        Object.defineProperty(this, 'registrationId', {
            'get': function () {
                return registrationId;
            }
        });
    
        var device = 'android';
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (iOS) device = 'ios';
    
        Object.defineProperty(this, 'device', {
            'get': function () {
                return device;
            }
        });
    
        function onRegistration(data) {
            if (!data) {
                return;
            }
            registrationId = data.registrationId;
            events.trigger('registration', registrationId);
        }
    
        function onNotification(data) {
    
            // var type = data.additionalData.type;
            // var coldstart = data.additionalData.coldstart;
            // var foreground = data.additionalData.foreground;
    
            events.trigger('notification', data);
            push.finish();
    
        }
    
        function onError(error) {
            beyond.logs.append('Push notification error: ' + error);
        }
    
        function onPhonegapDone() {
    
            if (typeof PushNotification !== 'object') {
                return;
            }
    
            var config = {
                "android": {
                    "senderID": beyond.params.pushNotifications.senderID
                },
                "ios": {
                    "alert": "true",
                    "badge": "true",
                    "sound": "true"
                    /*
                     "senderID": "...",
                     "gcmSandbox": "true"
                     */
                },
                "windows": {}
            };
    
            push = PushNotification.init(config);
    
            push.on('registration', onRegistration);
            push.on('notification', onNotification);
            push.on('error', onError);
    
        }
    
        if (phonegap.isPhonegap && beyond.params.pushNotifications) {
            phonegap.done(onPhonegapDone);
        }
    
    }
    
    var phonegap = beyond.phonegap;
    phonegap.push = new Push(phonegap);
    
    
    /********************
    phonegap/analytics.js
    ********************/
    
    function Analytics(phonegap) {
        "use strict";
    
        var configured;
        var ready;
        var accountID = beyond.params.analytics;
        var analytics;
    
        function success() {
            ready = true;
        }
    
        function error() {
            // nothing to do right now
        }
    
        function onPhonegapReady() {
            analytics = window.plugins.gaPlugin;
            if (!analytics) return;
    
            configured = true;
            analytics.init(success, error, accountID, 10);
        }
    
        if (accountID) {
            phonegap.done(onPhonegapReady);
        }
    
        this.trackEvent = function (category, action, label, value) {
    
            if (!configured) return;
            if (!ready) return;
    
            function success() {
                // nothing to do right now
            }
    
            function error() {
                // nothing to do right now
            }
    
            analytics.trackEvent(success, error, category, action, label, value);
    
        };
    
        this.trackPage = function (url) {
    
            if (!configured) return;
            if (!ready) return;
    
            function success() {
                // nothing to do right now
            }
    
            function error() {
                // nothing to do right now
            }
    
            analytics.trackPage(success, error, url);
    
        };
    
        this.exit = function (callback) {
    
            if (!ready) {
                if (callback) callback();
                return;
            }
    
            function success() {
                if (callback) callback();
            }
    
            function error() {
                // TODO: add an error handler
                if (callback) callback();
            }
    
            if (analytics) analytics.exit(success, error);
    
            ready = false;
    
        };
    
    }
    
    beyond.analytics = new Analytics(beyond.phonegap);
    
    
    /****************
    phonegap/badge.js
    ****************/
    
    function Badge(phonegap) {
        "use strict";
    
        var events = new Events({'bind': this});
    
        // Define different sources of unread notifications
        // Ex: inbox, newsfeed
        var values = {};
        Object.defineProperty(this, 'values', {
            'get': function () {
                return values;
            }
        });
    
        Object.defineProperty(this, 'value', {
            'get': function () {
                var value = 0;
    
                for (var i in values) {
                    value += values[i];
                }
    
                return value;
            }
        });
    
        var badge;
    
        var ready = Delegate(this, function () {
    
            if (typeof cordova === 'object' &&
                cordova.plugins &&
                cordova.plugins.notification) {
    
                badge = cordova.plugins.notification.badge;
                badge.set(this.value);
            }
    
        });
    
        phonegap.done(ready);
    
        this.set = function (source, value) {
    
            try {
                value = parseInt(value);
            }
            catch (exc) {
                console.error(exc);
                return;
            }
    
            values[source] = value;
    
            if (badge) {
                badge.set(this.value);
            }
    
            events.trigger('change', source, value);
            events.trigger('change:' + source, source, value);
    
        };
    
    }
    
    var phonegap = beyond.phonegap;
    phonegap.badge = new Badge(beyond.phonegap);
    
    
    
})();