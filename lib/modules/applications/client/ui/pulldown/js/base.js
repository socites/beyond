function BaseControl(control, createFnc) {
    "use strict";

    var texts = module.texts.es;

    var pulldown, pulled;

    function render() {

        var $host = $(control.host);

        var html = module.render('control', texts);
        $host.html(html);

        pulldown = new PullDown(control.host, control.parentScroller);

        pulldown.bind('pulled', function () {
            pulled = true;
            // Trigger pulled event
        });

        var ReactDOM = module.ReactDOM;

        var reactElement = createFnc();

        ReactDOM.render(
            reactElement,
            control.host.querySelector('.list'));

    }

    control.done(render);

}
