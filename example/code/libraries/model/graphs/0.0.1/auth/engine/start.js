/*******************
 LIBRARY NAME: graphs
 MODULE: auth/engine
 ********************/

(function (module) {

    module = module[0];

    /*****************************
     FILE NAME: session/account.js
     *****************************/

    var Account = function (ID, clusterID, user) {
        "use strict";

        if (typeof user !== 'object' ||
            typeof user.ID !== 'string' ||
            typeof user.email !== 'string' ||
            typeof user.name !== 'string' ||
            typeof user.lastName !== 'string') {

            user = undefined;

        }

        Object.defineProperty(this, 'clusterID', {
            'get': function () {
                return clusterID;
            }
        });

        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });

        Object.defineProperty(this, 'user', {
            'get': function () {
                return user;
            }
        });

        Object.defineProperty(this, 'valid', {
            'get': function () {
                return ID && user && clusterID;
            }
        });

        this.clean = function () {
            ID = user = undefined;
        };

    };


    /****************************
     FILE NAME: session/remote.js
     ****************************/

    var Remote = function (session, connected) {
        "use strict";

        // remote sign-in
        // sign-in using the credentials of the vertical session
        this.signin = function () {

            var remoteDSID, remoteSession, callback;

            if (arguments.length === 3) {
                remoteDSID = arguments[0];
                remoteSession = arguments[1];
                callback = arguments[2];
            }
            else if (arguments.length === 2 && name === 'vertical') {
                remoteSession = arguments[0];
                callback = arguments[1];
            }
            else {
                console.error('invalid arguments');
                return;
            }

            var params = {
                'token': remoteSession.token
            };

            if (remoteDSID) params.remoteDSID = remoteDSID;
            else params.remoteDSID = application.ds.ID;

            var action;
            if (name === 'vertical') action = 'remote/signin/vertical';
            else action = 'remote/signin/community';

            module.execute(action, params, function (response) {

                if (!response || !response.data || !response.data.session) {
                    if (callback) callback(false);
                    return;
                }

                connected.set(true);
                session.set(response.data.session);
                if (callback) callback(true);

            });

        };

    };


    /*****************************
     FILE NAME: session/signout.js
     *****************************/

    var Signout = function (session, clean, connected, events) {
        "use strict";

        session.signout = function (callback) {

            // take the token before cleaning the session data
            var token;
            if (session.valid) token = session.token;

            clean();

            if (!token) {
                if (callback) callback();
                return;
            }

            var params = {'token': token};

            module.execute('session/signout', params, function (response) {

                connected.set(false);
                events.trigger('signout');
                events.trigger('change');
                events.trigger('disconnect');

                if (response.error) {
                    console.error('error signing out', response);
                    layout.messages.push(
                        'error signing you out',
                        'Please try again in a couple of seconds.', 'error');
                }

                if (callback) callback();

            });

        };

    };


    /***************************************
     FILE NAME: session/connect/connected.js
     ***************************************/

    var Connected = function (session, events) {
        "use strict";

        // means that the socket on server has registered the session
        var connected = false;
        Object.defineProperty(session, 'connected', {
            'get': function () {
                return session.valid && connected;
            }
        });

        this.set = function (value) {

            var prev = connected;
            connected = value == true;
            if (!prev && connected) events.trigger('connect');

        };

    };


    /***************************************
     FILE NAME: session/connect/reconnect.js
     ***************************************/

    var Reconnect = function (session, connected) {
        "use strict";

        // reconnect the session with the server
        var reconnect = function () {

            if (!session.valid || session.connected) return;

            // do not try to reconnect to the vertical session when the application is a community
            // that belongs to a vertical
            // only used for local development environments, in production this case should never happen
            // this is because in development environments there is a unique domain localhost sharing
            // the vertical and the community applications
            if (application.local && session.name === 'vertical' && application.ds.vertical) return;

            var params = {
                'token': session.token,
                'dsID': session.ds.ID,
                'accountID': session.account.ID,
                'sessionName': session.name
            };

            module.execute('session/reconnect', params, function (response) {

                if (response && response.error) {
                    session.signout();
                    return;
                }

                // this can happen on session signout before reconnect
                if (!session.valid) return;

                connected.set(true);

            });

        };

        this.reconnect = reconnect;

        beyond.bind('connect', function () {
            if (session.valid) reconnect();
        });
        beyond.bind('disconnect', function () {
            connected.set(false);
        });

    };


    /*****************************
     FILE NAME: session/session.js
     *****************************/

    var Session = function (auth, name) {
        "use strict";

        var self = this;

        var events = new Events();
        this.bind = function (event, listener, priority) {
            events.bind(event, listener, priority);
        };
        this.unbind = function (event, listener) {
            events.unbind(event, listener);
        };

        Object.defineProperty(this, 'name', {
            'get': function () {
                return name;
            }
        });

        var connected = new Connected(this, events);
        var reconnect;
        beyond.bind('code/engine:loaded', function () {
            reconnect = new Reconnect(self, connected);
        });

        var remote = new Remote(this, connected);
        Object.defineProperty(this, 'remote', {
            'get': function () {
                return remote;
            }
        });

        var clean = function () {

            localStorage.removeItem('session:' + name);

            account.clean();
            token = undefined;
            ds = undefined;

        };

        var signout = new Signout(this, clean, connected, events);

        var token;
        Object.defineProperty(this, 'token', {
            'get': function () {
                return token;
            }
        });

        var account = new Account();
        Object.defineProperty(this, 'account', {
            'get': function () {
                return account;
            }
        });

        var ds;
        Object.defineProperty(this, 'ds', {
            'get': function () {
                return ds;
            }
        });

        Object.defineProperty(this, 'valid', {
            'get': function () {

                var valid =
                    (ds && typeof ds.ID === 'string' &&
                    account.valid &&
                    typeof token === 'string') == true;

                return valid;

            }
        });

        this.set = function (data) {

            // check if the session data is valid
            if (typeof data !== 'object' ||
                typeof data.ds !== 'object' ||
                typeof data.ds.ID !== 'string' ||
                typeof data.account !== 'object' ||
                typeof data.token !== 'string') {

                console.warn('invalid session information [1]: ', data);
                clean();
                events.trigger('change');
                return;

            }

            // check if the account has changed
            var accountID;
            if (this.valid) accountID = this.account.ID;

            account = new Account(data.account.ID, data.account.clusterID, data.account.user);
            token = data.token;
            ds = data.ds;

            if (!this.valid) {
                console.warn('session information is invalid [2]', data);
                clean();
                events.trigger('change');
                return;
            }

            if (data.connected) connected.set(true);

            // when the session is reconnected, this method is called,
            // but previously the session was set with the information stored
            // in the local storage
            // so comparing the accountID, it is avoiding to call twice the change event
            // and the signin event
            if (accountID !== this.account.ID) {

                events.trigger('signin');
                events.trigger('change');

            }

            save();

        };

        var load = function () {

            var stored = localStorage.getItem('session:' + name);
            if (stored) {
                try {

                    stored = JSON.parse(stored);
                    if (typeof stored !== 'object' || typeof stored.ds !== 'object') {
                        console.warn('stored session information is invalid', stored);
                        return;
                    }

                    if (stored.ds.ID !== application.ds.ID &&
                        (!stored.ds.vertical || stored.ds.vertical.ID !== application.ds.ID)) {

                        // as different clients are served from localhost
                        if (application.local) return;

                        var message = 'invalid session information, session refers to a different ds';
                        console.warn(message, stored.ds.ID, application.ds.ID);
                        return;

                    }

                    self.set(stored);
                    reconnect.reconnect();

                }
                catch (exc) {
                    console.warn('error parsing session', exc.message, stored);
                    return;
                }
            }

        };

        this.recover = function (data, revalidate) {

            if (!revalidate) {

                connected.set(false);
                this.set(data);
                reconnect.reconnect();

            }
            else {

                var params = {
                    'token': data.token,
                    'dsID': data.ds.ID,
                    'accountID': data.account.ID,
                    'sessionName': this.name
                };
                module.execute('session/recover', params, function (response) {

                    if (!response || response.error || !response.data || !response.data.session) {
                        console.log('invalid session recover', response);
                        return;
                    }

                    self.set(response.data.session);
                    connected.set(true);

                });

            }

        };

        var onApplication = function () {

            if (application.ready) load();
            else application.bind('ready', load);

        };
        if (beyond.modules.loaded['code/engine']) onApplication();
        else beyond.bind('code/engine:loaded', onApplication);

        var save = function () {

            if (!self.valid) return;

            var store = {
                'account': {
                    'ID': account.ID,
                    'clusterID': account.clusterID,
                    'user': account.user
                },
                'ds': ds,
                'token': token
            };

            localStorage.setItem('session:' + name, JSON.stringify(store));

        };


        if (name === beyond.params.session) {

            auth.forms.bind('signin', function (session) {
                "use strict";

                connected.set(true);
                self.set(session);

                auth.forms.hide();

            });

        }

        this.signin = function (email, password, callback) {

            module.execute('session/signin', {
                'email': email,
                'password': password
            }, function (response) {

                if (response.error) {
                    if (callback) callback(response.error);
                    return;
                }

                connected.set(true);
                self.set(response.data.session);

                callback();

            });

        };

    };


    /**********************
     FILE NAME: sessions.js
     **********************/

    var Sessions = function (auth, events) {
        "use strict";

        // the session of the community
        var community = new Session(auth, 'community');
        Object.defineProperty(this, 'community', {
            'get': function () {
                return community;
            },
            'set': function (value) {
                community.set(value);
            }
        });
        Object.defineProperty(auth, 'community', {
            'get': function () {
                return community;
            },
            'set': function (value) {
                community.set(value);
            }
        });

        // the session of the vertical
        var vertical = new Session(auth, 'vertical');
        Object.defineProperty(this, 'vertical', {
            'get': function () {
                return vertical;
            },
            'set': function (value) {
                vertical.set(value);
            }
        });
        Object.defineProperty(auth, 'vertical', {
            'get': function () {
                return vertical;
            },
            'set': function (value) {
                vertical.set(value);
            }
        });

        Object.defineProperty(auth, 'session', {
            'get': function () {
                return this[beyond.params.session];
            },
            'set': function (value) {
                this[beyond.params.session].set(value);
            }
        });

        this.signout = function (callback) {

            var onSignedOut = function () {
                events.trigger('signout');
                if (callback) callback();
            };

            var coordinate = new Coordinate(
                'vertical',
                'community',
                onSignedOut);

            if (community.valid) {
                community.signout(function () {
                    coordinate.done('community');
                });
            }
            else coordinate.done('community');

            if (vertical.valid) {
                vertical.signout(function () {
                    coordinate.done('vertical');
                });
            }
            else coordinate.done('vertical');

        };

        community.bind('signin', function () {
            events.trigger('signin', 'community');
            events.trigger('change');
        });

        community.bind('signout', function () {
            events.trigger('signout', 'community');
            events.trigger('change');
        });

        vertical.bind('signin', function () {
            events.trigger('signin', 'vertical');
            events.trigger('change');
        });

        vertical.bind('signout', function () {
            events.trigger('signout', 'vertical');
            events.trigger('change');
        });

    };


    /*******************
     FILE NAME: codes.js
     *******************/

    var Codes = function (auth, connected) {
        "use strict";

        // @dsID who is going to consume the code
        // @callback
        this.generate = function (dsID, callback) {

            if (!dsID || !callback) throw new Error('invalid arguments');

            var sessions = auth.sessions;

            var session;
            if (sessions.vertical.valid) session = sessions.vertical;
            else if (sessions.community.valid) session = sessions.community;

            if (!session) {
                callback();
                return;
            }

            var params = {'dsID': dsID, 'token': session.token};
            module.execute('codes/generate', params, function (code) {
                callback(code);
            });

        };

        this.signin = function (code, callback) {

            var params = {'code': code};

            module.execute('codes/signin', params, function (response) {

                if (response.error) {
                    console.warn(response.error);
                    callback();
                    return;
                }
                if (!response.session) {
                    console.error('session expected but not received');
                    callback();
                    return;
                }

                var session = response.session;
                session.connected = true;

                auth.community.set(response.session);
                if (callback) callback();

            });

        };

    };


    /*******************
     FILE NAME: forms.js
     *******************/

    var FormsController = function (auth) {
        "use strict";

        var events = new Events();
        this.bind = function (event, listener) {
            return events.bind(event, listener);
        };
        this.unbind = function (event, listener) {
            return events.unbind(event, listener);
        };

        var loading, forms;
        this.show = function () {
            "use strict";

            var formID, param, callback;
            for (var i in arguments) {
                if (typeof arguments[i] === 'string' && !formID) formID = arguments[i];
                else if (typeof arguments[i] === 'string') param = arguments[i];
                else if (typeof arguments[i] === 'function') callback = arguments[i];
                else {
                    console.error('invalid arguments, on auth forms open');
                    return;
                }
            }

            if (forms) {
                forms.show(formID, param);
                if (callback) callback();
                return;
            }

            if (loading) return;
            loading = true;

            var library;
            if (beyond.params.auth === 'page') library = 'code/auth/client/ui/page/module';
            else library = 'code/auth/client/ui/floating/module';

            require([library], function (o) {

                loading = false;
                forms = o.forms;

                forms.bind('close', function () {
                    forms.hide();
                    events.trigger('close');
                });
                forms.bind('signin', function (session) {
                    events.trigger('signin', session);
                });

                forms.show(formID, param);
                if (callback) callback();

            });

        };

        this.hide = function () {
            if (forms) forms.hide();
        };

    };


    /*********************
     FILE NAME: cluster.js
     *********************/

    var Cluster = function (auth) {
        "use strict";

        var token;
        var ID;
        Object.defineProperty(this, 'ID', {
            'get': function () {
                return ID;
            }
        });

        var fetched, fetching;
        Object.defineProperty(this, 'fetched', {
            'get': function () {
                return fetched;
            }
        });
        Object.defineProperty(this, 'fetching', {
            'get': function () {
                return fetching;
            }
        });

        var accounts = [];
        Object.defineProperty(this, 'accounts', {
            'get': function () {
                return accounts;
            }
        });

        // available only if user is registered only in one community
        var community;
        Object.defineProperty(this, 'community', {
            'get': function () {
                return community;
            }
        });

        var communities;
        if (!application.vertical) {
            Object.defineProperty(this, 'communities', {
                'get': function () {
                    return communities;
                }
            });
        }

        var email;
        Object.defineProperty(this, 'email', {
            'email': function () {
                return email;
            }
        });

        var update = function () {

            var prev = ID;

            if (auth.vertical.valid) {
                token = auth.vertical.token;
                ID = auth.vertical.account.clusterID;
            }
            else if (auth.community.valid) {
                token = auth.community.token;
                ID = auth.community.account.clusterID;
            }
            else {
                token = undefined;
                ID = undefined;
            }

            if (prev !== ID) {
                fetching = false;
                fetched = false;
                accounts = [];
                communities = undefined;
            }

        };
        update();
        auth.bind('change', update);

        var callbacks = [];
        this.fetch = function (done) {

            if (!ID) {
                console.error('signin before calling this action');
                return;
            }

            if (fetched) {
                done(accounts, communities, email);
                return;
            }
            callbacks.push(done);

            if (fetching) return;

            var params = {'token': token, 'clusterID': ID};
            module.execute('cluster/info', params, function (response) {

                fetched = true;

                // discard any previous fetch
                if (response.clusterID !== ID) return;

                email = response.email;
                accounts = response.accounts;
                communities = response.communities;
                community = response.community;

                for (var i in callbacks) callbacks[i](accounts, communities, email, community);
                callbacks = [];

            });

        };

    };


    /******************
     FILE NAME: auth.js
     ******************/

    var Auth = function (exports, events) {
        "use strict";

        exports.forms = new FormsController(exports);
        exports.sessions = new Sessions(exports, events);
        exports.codes = new Codes(exports);
        exports.cluster = new Cluster(exports);

        exports.signout = function (callback) {
            exports.sessions.signout(callback);
        };

    };

    window.auth = new (function () {
        "use strict";

        var ready = false;
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return ready;
            }
        });

        var events = new Events({'bind': this});

        this.initialise = function () {

            var application = window.application;
            application.done(function () {

                Auth(window.auth, events);
                ready = true;

                for (var i in callbacks) callbacks[i]();
                callbacks = undefined;


            });

        };

        var callbacks = [];
        this.done = function (callback) {

            if (!ready) {
                callbacks.push(callback);
                return;
            }

            callback();

        };

    });
    window.auth.initialise();


})(beyond.modules.get('libraries/graphs/auth/engine'));