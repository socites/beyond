function Page() {
    "use strict";

    this.show = function (state, done) {
        $('body').html('hello world!');
        if (done) done();
    };

}
