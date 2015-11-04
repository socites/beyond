extending.plugins.register(function () {
    "use strict";

    this.render = function ($container) {
        $container.html('nice plugin');
    };

});
