function Page() {
    "use strict";

    var texts = {'title': 'Hello world'};

    function initialise() {
    }

    this.template.render({'control': '', 'texts': texts})
        .then(initialise);

}
