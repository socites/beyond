(function() {
    var yaol = require('yaol');
    var yaolMessenger = 'BeyondJS';
        
    module.exports = function (application, buildPath, config, specs) {
        "use strict";
        
        var m = this;
    
        if (!config) {
            yaol.error(yaolMessenger,'invalid build configuration on application "'+application.name+'"');
            m.valid = false;
            return;
        }
    
        let path = config.path;
        if (!path) path = application.name;
    
        m.js = require('path').resolve(buildPath, 'applications/js', path);
        m.ws = require('path').resolve(buildPath, 'applications/ws', path, application.version);
    
        m.dirname = require('path').resolve(buildPath, path);
    
        m.hosts = require('./hosts.js')(application, config.hosts, specs);
        if (!m.hosts) m.valid = false;
    
    };
})();
