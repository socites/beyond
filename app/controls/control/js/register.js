(function () {
    "use strict";

    var dependencies = module.dependencies;

    beyond.ui.Control('beyond-control', dependencies, function () {

        var sna = new SNA();

        var Index = react.index;
        return module.React.createElement(Index, {'sna': sna});

    });

})();
