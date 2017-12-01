/*******************
LIBRARY NAME: vendor
MODULE: .
********************/

(function (params) {

    var done = params[1];
    var module = params[0];
    var react = module.react.items;

    /****************
    require.config.js
    ****************/
    
    (function (config, vendorPath) {
        "use strict";
    
        var paths = {
            'jquery': vendorPath + '/static/bower_components/jquery/dist/jquery',
            'require.js': vendorPath + '/static/require.js/require',
            'socket.io': vendorPath + '/static/socket.io/socket.io.min',
            'react': vendorPath + '/static/react/react',
            'react-dom': vendorPath + '/static/react/react-dom'
        };
    
        if (!beyond.params.local) {
            paths['jquery'] += '.min';
            paths['require.js'] += '.min';
            paths['react'] += '.min';
            paths['react-dom'] += '.min';
        }
    
        requirejs.config({
            paths: paths
        });
    
        requirejs.config({
            shim: {
                'react': {
                    // the following line allows you to inject React in your modules
                    // instead of using it as a global
                    exports: 'React'
                },
                // the following line declares that react-dom depends on react, so
                // RequireJS will load react first whenever you require react-dom
                'react-dom': {
                    'deps': ['react'],
                    'exports': 'ReactDOM'
                }
            }
        });
    
    })(requirejs.config, beyond.requireConfig.paths['libraries/vendor']);
    
    
    /******************
    controls/control.js
    ******************/
    
    var Control = function (name, specs) {
        "use strict";
    
        var path = specs.path;
        var type = (specs.type) ? specs.type : 'control';
    
        Object.defineProperty(this, 'name', {
            'get': function () {
                return name;
            }
        });
    
        if (path.substr(0, 7) !== 'http://' || path.substr(0, 8) !== 'https://') {
    
            if (path.substr(0, 12) === 'application/') {
    
                // shift the "application" string
                path = path.split('/')
                path.shift();
                var componentPath = path.join('/');
                path = beyond.requireConfig.paths['application'] + '/' + componentPath + '/' + type + '.html';
    
            }
            else if (path.substr(0, 10) === 'libraries/') {
    
                var original = path;
    
                path = path.split('/');
    
                // shift the "libraries" string
                path.shift();
                // shift the library name
                var libraryName = path.shift();
    
                path = path.join('/');
    
                // search the library path
                var libraryPath = beyond.requireConfig.paths['libraries/' + libraryName];
                if (!libraryPath) {
                    console.warn('library ' + libraryName + ' does not exist, check the module "' + original + '"');
                    return;
                }
    
                path = libraryPath + '/' + path;
    
                var multilanguage = beyond.modules.multilanguage.get(original);
                if (multilanguage && multilanguage.indexOf(type) !== -1) {
                    path += '/' + type + '/' + beyond.params.language + '.html';
                }
                else {
                    path += '/' + type + '.html';
                }
    
            }
            else {
    
                var vendor;
                vendor = beyond.requireConfig.paths['libraries/vendor'];
                vendor = vendor + '/static/bower_components/';
    
                path = vendor + path;
    
            }
    
        }
    
        Object.defineProperty(this, 'path', {
            'get': function () {
                return path;
            }
        });
    
    
        var loaded;
        Object.defineProperty(this, 'loaded', {
            'get': function () {
                return !!loaded;
            }
        });
    
        var loading;
        Object.defineProperty(this, 'loading', {
            'get': function () {
                return !!loading;
            }
        });
    
        var callbacks = [];
    
        this.load = function (callback) {
    
            if (loaded) {
                callback();
                return;
            }
    
            callbacks.push(callback);
    
            if (loading) return;
    
            loading = true;
            window.Polymer.Base.importHref(path, function () {
    
                loading = false;
                loaded = true;
    
                for (var i in callbacks) {
                    callbacks[i]();
                }
                callbacks = [];
    
            });
    
        };
    
    };
    
    
    /*******************
    controls/controls.js
    *******************/
    
    var Controls = function () {
        "use strict";
    
        var events = new Events({'bind': this});
    
        var ready;
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return ready;
            }
        });
    
        var controls = [];
        Object.defineProperty(this, 'list', {
            'get': function () {
                return controls;
            }
        });
    
        this.register = function (register) {
    
            for (var name in register) {
    
                var specs = register[name];
                if (typeof specs === 'string') {
                    specs = {'path': specs};
                }
    
                controls[name] = new Control(name, specs);
    
            }
    
        };
    
        function importControls(controlsToImport, callback) {
    
            var coordinate = new Coordinate(controlsToImport, callback);
    
            for (var i in controlsToImport) {
    
                (function (control) {
    
                    control = controls[control];
                    if (!control) {
                        console.error('Control "' + controlsToImport[i] + '" is not registered.');
                        return;
                    }
    
                    control.load(coordinate[control.name]);
    
                })(controlsToImport[i]);
    
            }
    
        }
    
        this.import = function (controlsToImport, callback) {
    
            if (!ready) {
                this.done(Delegate(importControls, controlsToImport, callback));
                return;
            }
    
            importControls(controlsToImport, callback);
    
        };
    
        var callbacks = [];
        this.done = function (callback) {
    
            if (ready) {
                callback();
                return;
            }
    
            callbacks.push(callback);
    
        };
    
        // Polymer is ready when beyond is ready
        beyond.done(function () {
    
            ready = true;
            events.trigger('ready');
    
            for (var i in callbacks) {
                callbacks[i]();
            }
    
            callbacks = [];
    
        });
    
    };
    
    beyond.controls = new Controls();
    
    
    /*******************
    controls/register.js
    *******************/
    
    beyond.controls.register({
        'font-roboto': 'font-roboto/roboto.html',
        'paper-button': 'paper-button/paper-button.html',
        'paper-drawer-panel': 'paper-drawer-panel/paper-drawer-panel.html',
        'paper-header-panel': 'paper-header-panel/paper-header-panel.html',
        'paper-scroll-header-panel': 'paper-scroll-header-panel/paper-scroll-header-panel.html',
        'paper-toolbar': 'paper-toolbar/paper-toolbar.html',
        'paper-item': 'paper-item/paper-item.html',
        'paper-icon-item': 'paper-item/paper-icon-item.html',
        'paper-menu': 'paper-menu/paper-menu.html',
        'iron-icon': 'iron-icon/iron-icon.html',
        'iron-icons': 'iron-icons/iron-icons.html',
        'av-icons': 'iron-icons/av-icons.html',
        'maps-icons': 'iron-icons/maps-icons.html',
        'communication-icons': 'iron-icons/communication-icons.html',
        'device-icons': 'iron-icons/device-icons.html',
        'editor-icons': 'iron-icons/editor-icons.html',
        'image-icons': 'iron-icons/image-icons.html',
        'notification-icons': 'iron-icons/notification-icons.html',
        'places-icons': 'iron-icons/places-icons.html',
        'hardware-icons': 'iron-icons/hardware-icons.html',
        'social-icons': 'iron-icons/social-icons.html',
        'iron-iconset': 'iron-iconset/iron-iconset.html',
        'iron-iconset-svg': 'iron-iconset-svg/iron-iconset-svg.html',
        'paper-icon-button': 'paper-icon-button/paper-icon-button.html',
        'paper-card': 'paper-card/paper-card.html',
        'paper-tabs': 'paper-tabs/paper-tabs.html',
        'paper-input': 'paper-input/paper-input.html',
        'paper-textarea': 'paper-input/paper-textarea.html',
        'paper-spinner': 'paper-spinner/paper-spinner.html',
        'paper-radio-button': 'paper-radio-button/paper-radio-button.html',
        'paper-radio-group': 'paper-radio-group/paper-radio-group.html',
        'iron-pages': 'iron-pages/iron-pages.html',
        'iron-image': 'iron-image/iron-image.html',
        'iron-flex-layout': 'iron-flex-layout/iron-flex-layout.html',
        'iron-flex-layout-classes': 'iron-flex-layout/iron-flex-layout-classes.html',
        'iron-form': 'iron-form/iron-form.html',
        'gold-email-input': 'gold-email-input/gold-email-input.html',
        'gold-cc-input': 'gold-cc-input/gold-cc-input.html',
        'gold-cc-expiration-input': 'gold-cc-expiration-input/gold-cc-expiration-input.html',
        'paper-toast': 'paper-toast/paper-toast.html',
        'paper-material': 'paper-material/paper-material.html',
        'paper-dropdown-menu': 'paper-dropdown-menu/paper-dropdown-menu.html',
        'paper-listbox': 'paper-listbox/paper-listbox.html',
        'paper-dialog': 'paper-dialog/paper-dialog.html',
        'neon-animations': 'neon-animation/neon-animations.html',
        'paper-menu-button': 'paper-menu-button/paper-menu-button.html',
        'paper-badge': 'paper-badge/paper-badge.html',
        'paper-ripple': 'paper-ripple/paper-ripple.html',
        'paper-checkbox': 'paper-checkbox/paper-checkbox.html',
        'paper-progress': 'paper-progress/paper-progress.html',
        'iron-scroll-threshold': 'iron-scroll-threshold/iron-scroll-threshold.html'
    });
    
    
    
    done('libraries/vendor/main', 'code');

})(beyond.modules.get('libraries/vendor/main'));