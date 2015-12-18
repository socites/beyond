(function() {
    'use strict';
    
    var async = require('async');
    var yaol = require('yaol');
    var yaolMessenger = 'BeyondJS';
    
    module.exports = async(function *(resolve, reject, file) {
    
        file = require('path').resolve(process.cwd(), file);
    
        let fs = require('fs');
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
            yaol.error(yaolMessenger,'configuration file not found: ' + file);
            return;
        }
    
        let config = fs.readFileSync(file, {'encoding': 'UTF8'});
        try {
            config = JSON.parse(config);
        }
        catch (exc) {
            yaol.error(yaolMessenger,'configuration file "' + file + '" is invalid');
            yaol.error(yaolMessenger,exc.message);
            return;
        }
    
        if (typeof config !== 'object') {
            yaol.error(yaolMessenger,'configuration file "' + file + '" is invalid');
            return;
        }
    
        config.dirname = require('path').dirname(file);
    
        resolve(config);
    
    });
})();