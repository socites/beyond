let registers = new Map();
beyond.modules.extend('react', {'type': 'property'}, function (module, events) {

    if (registers.has(module.id)) {
        return registers.get(module.id);
    }

    let r = new ReactRegister(this, events);
    registers.set(module.id, r);
    return r;

});
