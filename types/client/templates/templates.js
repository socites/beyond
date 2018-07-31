let ModuleTemplates = function (module) {

    let templates = {};

    this.register = function (path, template) {
        if (templates.hasOwnProperty(path)) {
            console.error(`Template "${path}" is already registered in module "${module.ID}"`);
        }
        templates[path] = template;
    };

    this.render = function (path, params) {
        if (!templates.hasOwnProperty(path)) {
            console.error(`Invalid template path: "${path}"`);
            return '';
        }
        return templates[path].render(params);
    };

};
