(function () {
    "use strict";

    beyond.ui.PullDown('beyond-pulldown-control', function () {

        var sna = new SNA();

        var List = react.list;
        return module.React.createElement(List, {'sna': sna});

    });

})();
