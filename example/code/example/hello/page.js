function Page() {
    "use strict";

    this.show = function (state, done) {
        console.log('hello page');
        done();
    };

}

define(function () {
    "use strict";
    return Page;
})
