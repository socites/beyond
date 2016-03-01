function Widgets() {

    this.register = function (moduleID, specs) {

        var name = specs.name;
        var dependencies = specs.dependencies;

        if (typeof name !== 'string') {
            console.error('invalid widget name on module: "' + moduleID + '"');
            return;
        }

        this[name] = WidgetWrapper(dependencies);

    };

}
