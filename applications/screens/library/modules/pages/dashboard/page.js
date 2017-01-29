function Page($container, parameter, dependencies) {
    "use strict";

    var model = dependencies.model.dashboard;

    this.preview = function () {

        $container
            .attr('id', 'dashboard-page')
            .html(module.render('page', module.texts));

        var spinner = $container.find('paper-toolbar paper-spinner').get(0);
        var $update = $container.find('paper-button');
        $update.bind('click', function () {

            spinner.active = true;
            model.update('screen1', 'welcome', {'message': 'Its\'s Working!'})
                .then(function () {
                    spinner.active = false;
                });

        });

    };

}
