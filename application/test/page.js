function Page() {
    'use strict';

    function initialise() {
        console.log('page initialised');
    }

    this.template.render({'texts': {'title': 'Hello world'}})
        .then(initialise);

}
