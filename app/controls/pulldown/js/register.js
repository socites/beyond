(function () {
    "use strict";

    var dependencies = module.dependencies;
    var sna;

    function ExampleBehavior() {

        var control;

        this.created = function () {
            control = this;
        };

        this.setCoolAttribute = function (value) {
            console.log('cool attribute is set', value);
        };

        this.properties = {
            'coolAttribute': {
                'type': String,
                'observer': 'setCoolAttribute'
            }
        };

    }

    beyond.ui.PullDown('beyond-pulldown-control', dependencies, function () {

        sna = new SNA();

        var List = react.list;
        return module.React.createElement(List, {'sna': sna});

    }, [new ExampleBehavior()]);

})();
