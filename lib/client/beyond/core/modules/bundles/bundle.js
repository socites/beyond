function Bundle(module, name) {

    Object.defineProperty(this, 'module', {'get': () => module});
    Object.defineProperty(this, 'name', {'get': () => name});

    let dependencies = new Dependencies();
    Object.defineProperty(this, 'dependencies', {'get': () => dependencies});

    let multilanguage;
    Object.defineProperty(this, 'multilanguage', {
        'get': () => !!multilanguage,
        'set': (value) => {

            if (multilanguage !== undefined) {
                console.warn(`Multilanguage attribute on bundle "${module}/${name}" should not be set twice`);
                return;
            }

            multilanguage = !!value;

        }
    });

}
