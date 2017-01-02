function Page($container, parameter, dependencies) {
    "use strict";

    var sna = new SNA();

    this.prepare = function (state, done) {

        $container.attr('id', 'dynamic-page');

        var List = react.list;
        module.ReactDOM.render(
            module.React.createElement(List, {'sna': sna}),
            $container.get(0));

        done();

    };

}
