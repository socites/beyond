function BaseControl(control, createFnc) {
    "use strict";

    var texts = module.texts;
    console.log('texts', texts);

    var pulldown, pulled;

    function onReady() {

        pulldown = new PullDown(host);
        pulldown.setParentScroller(parentScroller);

        pulldown.bind('pulled', function () {
            pulled = true;
            // Trigger pulled event
        });

        var ReactDOM = module.ReactDOM;

        var reactElement = createFnc();

        ReactDOM.render(
            reactElement,
            host.querySelector('.list'));

    }

    control.done(function () {
        console.log('coordinate done');
    });

}
