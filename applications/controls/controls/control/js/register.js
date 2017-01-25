module.controls.define('Control', {
    'create': function () {
        "use strict";
        var sna = new SNA();
        return module.React.createElement(react.index, {'sna': sna});
    }
});
