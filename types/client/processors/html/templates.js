let ModuleTemplates = function (module) {

    let templates = new Map();

    this.register = function (template, code) {

        if (templates.hasOwnProperty(template)) {
            console.error(`Template "${template}" is already registered in module "${module.id}"`);
        }

        templates.set(template, code);

    };

    this.render = function (template, params) {

        if (!templates.has(template)) {
            throw new Error(`Invalid template path: "${template}"`);
        }

        return templates.get(template).render(params);

    };

};
