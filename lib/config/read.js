(function() {
    'use strict';
    
    var async = require('async');
    var output = require('../config/output');
    
    module.exports = async(function *(resolve, reject, file) {
    
        file = require('path').resolve(process.cwd(), file);
    
        let fs = require('fs');
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
            output.error('configuration file not found: ' + file);
            return;
        }
    
        let config = fs.readFileSync(file, {'encoding': 'UTF8'});
        try {
            config = JSON.parse(config);
        }
        catch (exc) {
            output.error('configuration file "' + file + '" is invalid');
            output.error(exc.message);
            return;
        }
    
        if (typeof config !== 'object') {
            output.error('configuration file "' + file + '" is invalid');
            return;
        }
    
        config.dirname = require('path').dirname(file);
    
        resolve(config);
    
    });
})();