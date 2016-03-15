// compile application static resources
module.exports = require('async')(function *(resolve, reject, application, pathJS, pathWS, language) {
    "use strict";

    let save = require('../fs/save');

    console.log('\tbuiling static files'.green);

    yield application.static.process(language);
    for (let key of application.static.keys) {

        let file = application.static.items[key];
        let target = require('path').join(pathJS, key);
        yield save(target, file.content);

    }

    resolve();

});
