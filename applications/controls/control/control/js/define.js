module.control.define({
    'properties': {
        'title': {
            'type': String,
            'observer': 'setTitle',
            'stateSource': 'title',
            'notify': true
        }
    },
    'methods': ['refresh'],
    'SNA': function (dependencies) {
        return new SNA();
    },
    'react': 'index'
});

/*
 'create': function () {
 "use strict";
 var sna = new SNA();
 return module.React.createElement(react.index, {'sna': sna});
 }
 */
