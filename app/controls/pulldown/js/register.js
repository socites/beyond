(function () {
    "use strict";

    var dependencies = module.dependencies;

    beyond.ui.PullDown('beyond-pulldown-control', dependencies, function () {

        var sna = new SNA();

        var List = react.list;
        return module.React.createElement(List, {'sna': sna});

    });

})();
