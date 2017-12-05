function Page() {
    "use strict";

    function initialise() {
        console.log('page initialised');
    }

    this.template.render({'control': 'beyond-applications', 'texts': {'title': 'Hello world'}})
        .then(initialise);

}
