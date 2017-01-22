require('colors');

module.exports = require('async')(function *(resolve, reject, version, language, specs) {
    "use strict";

    yield version.modules.process();

    if (!version.modules.keys.length) {
        console.log('\tno modules found');
        resolve();
        return;
    }

    // Initialise all modules
    for (let key of version.modules.keys) {

        let module = version.modules.items[key];
        yield module.initialise();

        // create the module.json file
        let json = {'client': {}, 'server': {}};

        console.log('\tbuilding module '.green + (key).bold.green);

    }

});
