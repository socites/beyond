function Page($container, parameter, dependencies) {
    "use strict";

    function loadModule1() {

        require(['application/module1/code'], function (mod1) {
            console.log(mod1);
        });

    }

    this.preview = function () {

        $container.html(module.render('page'));
        $container.find('paper-button.load-module1').click(loadModule1);

    };

}
