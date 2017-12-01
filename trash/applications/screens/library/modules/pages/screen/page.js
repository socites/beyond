function Page($container, parameter, dependencies) {
    "use strict";

    var screen = parameter;
    screen = new dependencies.model.Screen(screen);

    var $content;

    function update(params) {

        var template = params.template;
        var data = params.data;

        var html = module.render('templates/' + template + '/template', data);
        $content.html(html);

    }

    this.preview = function () {

        $container
            .attr('id', 'screen-page')
            .html(module.render('page', module.texts));

        $content = $container.find('.page-content');

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
