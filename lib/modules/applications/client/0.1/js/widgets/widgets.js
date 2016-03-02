function Widgets() {

    this.register = function (module, specs) {

        var name = specs.name;
        var dependencies = specs.dependencies;

        if (typeof name !== 'string') {
            console.error('invalid widget name on module: "' + module.ID + '"');
            return;
        }

        this[name] = WidgetWrapper(module, dependencies);

    };

}
