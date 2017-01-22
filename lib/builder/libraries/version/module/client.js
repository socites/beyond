require('colors');

module.exports = require('async')(function *(resolve, reject, module, languages, specs, path) {
    "use strict";

    let fs = require('co-fs');
    let mkdir = require('../../../fs/mkdir');
    let save = require('../../../fs/save');
    let copy = require('../../../fs/copy');

    let json = {};

    for (let name in module.types) {

        let type = module.types[name];
        let multilanguage = type.multilanguage;
        console.log('\t\t\t' + name + ' - ' + ((multilanguage) ? 'multilanguage' : 'no languages'));

        json[name] = {
            'multilanguage': multilanguage,
            'source': {}
        };

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

        }

    }

    // copying static resources
    if (module.static) {

        moduleJson.js.static = module.static.config;

        yield module.static.process();
        for (let path of module.static.keys) {

            let resource = module.static.items[path];

            let target = require('path').join(
                version.build.js,
                module.path,
                'static',
                resource.relative.file);

            if (resource.content) {
                yield save(target, resource.content);
            }
            else {
                yield copy.file(resource.file, target);
            }

        }

    }

    // saving module.json file
    if (specs.mode === 'beyond') {

        let target = (module.path === '.') ? 'main' : module.path;
        target = require('path').join(
            path,
            target,
            'module.json');

        yield save(target, JSON.stringify(json));

    }

    resolve();

});
