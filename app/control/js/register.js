(function () {
    "use strict";

    var sna = new SNA();

    beyond.ui.PullDown('beyond-example-control', function () {
        var List = react.list;
        var reactElement = module.React.createElement(List, {'sna': sna});
    });

})();
