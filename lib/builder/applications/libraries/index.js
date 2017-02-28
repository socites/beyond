// compile imported libraries
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    pathJS = require('path').join(pathJS, 'libraries');

    console.log('\tbuiling libraries'.green);

    for (let name of application.libraries.keys) {

        console.log('\t\tbuiling library '.green + (name).green.bold);
        let library = application.libraries.items[name];

        yield library.modules.process();

        if (!library.modules.keys.length) {
            console.log('\t\t\t\tno modules found');
            continue;
        }

        for (let key of library.modules.keys) {

            let module = library.modules.items[key];
            console.log('\t\t\t\tbuiling module '.green + (key).bold.green);

            yield require('./module')(module, language, pathJS);

        }

    }

    resolve();

});
