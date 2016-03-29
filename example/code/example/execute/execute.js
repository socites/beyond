var Page = function () {
    "use strict";

    this.show = function (state, done) {

        module.execute('welcome', function (message) {
            console.log(message);
        }, {'cache': {'read': true}});

        done();

    };

};

define(function () {
    "use strict";
    return Page;
});
