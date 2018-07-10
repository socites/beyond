function Page() {
    'use strict';

    let dependencies = this.dependencies;

    function initialise() {



    }

    this.template.render({'texts': {'title': 'Testing Sockets'}})
        .then(initialise);

}
