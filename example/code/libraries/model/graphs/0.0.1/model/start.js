/*******************
LIBRARY NAME: graphs
MODULE: model
********************/

(function (module) {

    module = module[0];

    /*************************
     FILE NAME: application.js
     *************************/
    
    beyond.channels.bind('connect:before', function (query) {
        "use strict";
    
        var application = beyond.params.application;
        if (application) query.application = JSON.stringify(application);
    
    });
    
    var application = function (exports, data) {
        "use strict";
    
        var expose = function (prop, value, obj) {
            Object.defineProperty(obj, prop, {
                'get': function () {
                    return value;
                }
            })
        };
    
        expose('ID', data.ID, exports);
        expose('dsName', data.dsName, exports);
        expose('url', data.attributes.url, exports);
        expose('picture', data.picture, exports);
        expose('name', data.document.name, exports);
        expose('description', data.document.description, exports);
    
        if (data.vertical) {
            exports.vertical = {};
            application(exports.vertical, data.vertical)
        }
    
    };
    
    
    window.application = new (function () {
        "use strict";
    
        var ready = false;
        Object.defineProperty(this, 'ready', {
            'get': function () {
                return ready;
            }
        });
    
        var events = new Events({'bind': this});
    
        module.library.channel(function (channel) {
    
            channel.on('application', function (response) {
                application(window.application, response);
            });
    
            ready = true;
            events.trigger('ready');
            for (var i in callbacks) {
                callbacks[i](window.application);
            }
            callbacks[i] = undefined;
    
        });
    
        var callbacks = [];
        this.done = function (callback) {
    
            if (!ready) {
                callbacks.push(callback);
                return;
            }
    
            callback(window.application);
    
        };
    
    });
    
    
    
})(beyond.modules.get('libraries/graphs/model'));