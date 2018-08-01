let templates = new Map();
beyond.modules.extend('templates', {'type': 'property'}, function (module) {

    if (templates.has(module.id)) {
        return templates.get(module.id);
    }

    let mt = new ModuleTemplates(module);
    templates.set(module.id, mt);
    return mt;

});

beyond.modules.extend('render', function (module, template, params) {

    if (!templates.has(module.id)) {
        throw new Error(`Module "${module.id}" does not have defined html templates`);
    }

    return templates.get(module.id).render(template, params);

});
