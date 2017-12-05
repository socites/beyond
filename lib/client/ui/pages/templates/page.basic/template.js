function Template($container) {
    "use strict";

    var control;

    var $content;
    Object.defineProperty(this, '$content', {
        'get': function () {
            return $content;
        }
    });
    Object.defineProperty(this, 'content', {
        'get': function () {
            return ($content) ? $content.get(0) : undefined;
        }
    });

    function render(texts, transitions) {

        var html = module.render('template', texts);

        $container
            .html(html)
            .addClass(transitions.DEFAULT)
            .addClass('page-control-template');

    }

    this.render = function (specs) {

        specs = (!specs) ? {} : specs;

        return new Promise(function (resolve) {

            module.dependencies.done(function (dependencies) {

                var transitions = dependencies.transitions;
                render(specs.texts, transitions);

                if (!specs.control) {
                    $container.addClass('no-control');
                }

                control = (specs.control) ? new Control($container, specs.control) : undefined;

                if (control && control.valid) {
                    $content = control.$control;
                    control.done().then(resolve);
                }
                else {
                    $content = $('<div/>').addClass('content');
                    $container.append($content);
                    resolve();
                }

            });

        });

    };

}
