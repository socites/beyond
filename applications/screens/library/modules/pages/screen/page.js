function Page($container, parameter, dependencies) {
    "use strict";

    var screen = parameter;
    screen = new dependencies.model.Screen(screen);

    function update(params) {

        var template = params.template;
        var data = params.data;

        $container.html(module.render(template, data));

    }

    this.preview = function () {

        $container
            .attr('id', 'screen-page')
            .html(module.render('page', module.texts));

        var spinner = $container.find('paper-toolbar paper-spinner').get(0);
        var $join = $container.find('paper-button');
        $join.bind('click', function () {

            screen.bind('update', update);
            if (screen.data) {
                update();
            }
            else {
                spinner.active = true;
                screen.get()
                    .then(function () {
                        spinner.active = false;
                    });
            }

            screen.join();

        });

    };

}
