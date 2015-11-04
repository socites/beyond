var HeaderActions = function ($container) {
    "use strict";

    this.push = function (params) {

        var action = new HeaderAction($container, params);
        return action;

    };

    this.clear = function () {
        $container.html('');
    };

};
