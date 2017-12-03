function Template($container) {
    "use strict";

    var control;

    function render(texts, transitions) {

        var html = module.render('template', texts);

        $container
            .html(html)
            .addClass(transitions.DEFAULT)
            .addClass('page-control-template');

    }

    this.render = function (texts, specs) {

        var template = this;
        specs = (!specs) ? {} : specs;

        return new Promise(function (resolve) {

            module.dependencies.done(function (dependencies) {

                var transitions = dependencies.transitions;
                render(specs.texts, transitions);

                control = (specs.control) ? new Control(template, specs.control) : undefined;

                if (control && control.valid) {
                    control.done(resolve);
                }
                else {
                    resolve();
                }

            });

        });

    };

}
