let texts = new Map();
beyond.modules.extend('texts', {'type': 'property'}, function (module) {

    if (texts.has(module.id)) {
        return texts.get(module.id);
    }

    let txt = new ModuleTexts(module);
    texts.set(module.id, txt);
    return txt;

});
