module.exports = require('async')(function *(resolve, reject, module, languages, json, path, events) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../../../../fs/mkdir');
    let save = require('../../../../fs/save');

    for (let name in module.types) {

        let type = module.types[name];
        let multilanguage = type.multilanguage;
        events.emit('message', name + ' - ' + ((multilanguage) ? 'multilanguage' : 'no languages'));

        json[name] = {};
        yield type.setBuildConfig(json[name]);

        json[name].multilanguage = multilanguage;
        json[name].source = {};

        if (multilanguage) {
            for (let language of languages) {

                let file = language + type.extname;
                json[name].source[language] = require('path').join(name, file);
                let resource = yield type.process(language);

                let target = (module.path === '.') ? 'main' : module.path;
                target = require('path').join(path, target, name);

                // check if destination path exists
                if (!(yield fs.exists(target))) {
                    yield mkdir(target);
                }

                target = require('path').join(target, file);
                yield save(target, resource.content);

            }
        }
        else {

            let file = name + type.extname;
            json[name].source = file;
            let resource = yield type.process();

            let target = (module.path === '.') ? 'main' : module.path;
            target = require('path').join(path, target);

            // check if destination path exists
            if (!(yield fs.exists(target))) {
                yield mkdir(target);
            }

            target = require('path').join(target, file);
            yield save(target, resource.content);

        }

    }

    resolve();

});
