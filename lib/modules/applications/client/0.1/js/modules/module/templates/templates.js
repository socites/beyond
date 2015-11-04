var ModuleTemplates = function (module) {

    var templates = {};

    this.register = function (path, template) {

        if (templates[path]) {
            console.error('template "' + path + '" is already registered in module "' + module.ID + '"');
        }

        templates[path] = template;

    };

    this.render = function (path, params) {

        if (!templates[path]) {
            console.error('invalid template path: "' + path + '"');
            return '';
        }

        return templates[path].render(params);

    };

};
