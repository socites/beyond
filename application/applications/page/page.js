function Page() {
    "use strict";

    function initialise() {
    }

    this.template.render({'control': '', 'texts': {'title': 'Hello world'}})
        .then(initialise);

}
