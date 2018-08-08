let controls = new Map();
beyond.modules.extend('control', {'type': 'property'}, function () {

    if (controls.has(module.id)) {
        return controls.get(module.id);
    }

    let c = new Control(this);
    controls.set(module.id, c);
    return c;

});
