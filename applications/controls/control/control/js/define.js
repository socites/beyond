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
    'sna': function (dependencies) {
        return new SNA();
    },
    'react': 'index'
});
