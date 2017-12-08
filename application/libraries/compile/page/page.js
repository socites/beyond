function Page() {
    "use strict";

    var texts = module.texts;

    var template = this.template;

    this.prepare = function (done) {

        var control = 'beyond-compile-library';

        template.render({
            'control': control,
            'texts': texts
        }).then(done);

    };

    this.show = function () {

        template.content.library = this.querystring.library;

    };

}
