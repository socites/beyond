function Page() {
    "use strict";

    var control = 'beyond-compile';
    var texts = module.texts;

    var template = this.template;

    this.prepare = function (done) {

        template.render({
            'control': control,
            'texts': texts
        }).then(done);

    };

    this.show = function () {

    };

}
