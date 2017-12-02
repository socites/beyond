function Page($container, vdir, dependencies) {
    "use strict";

    var template = new dependencies.Template($container);

    function initialise() {
        console.log('control', template.control);
    }

    template.render({'control': ''})
        .then(initialise);

}
