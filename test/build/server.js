(function (beyond) {
    "use strict";

    let server = new beyond.Server('server.json', {'environment': 'development'});
    server.start();

})(require('../..'));
