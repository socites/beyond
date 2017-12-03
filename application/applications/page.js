function Page($container, vdir, dependencies) {
    "use strict";

    var template = new dependencies.Template($container);

    function initialise() {
    }

    var texts = {'title': 'Hello world'};

    template.render({'control': '', 'texts': texts})
        .then(initialise);

}
