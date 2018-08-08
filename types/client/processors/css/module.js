let styles = new Map();
beyond.modules.extend('css', {'type': 'property'}, function (module) {

    if (styles.has(module.id)) {
        return styles.get(module.id);
    }

    let s = new ModuleStyles(this);
    styles.set(module.id, s);
    return s;

});
