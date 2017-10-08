beyond.bind('routing', function (pathname, done) {
    "use strict";

    if (pathname !== '/') {
        done();
        return;
    }

    done({'pathname': '/tests'});

});
