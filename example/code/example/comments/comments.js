var Page = function () {
    "use strict";

    this.show = function (state, done) {

        require(['libraries/comments/main'], function (o) {

            var opinions = new o.Opinions();
            opinions.attributes.containerID = '551c5bcd3133301b1c1ae833';

            var page = opinions.pages.get(1);
            page.bind('fetched', function (objects) {

                for (var i in objects) {
                    console.log(objects[i].document.text.value);
                }

            });
            page.fetch();

        });

        done();

    };

};

define(function () {
    "use strict";

    return {
        'Controller': Page
    };

});
