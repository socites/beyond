function BaseControl(control, createFnc) {
    "use strict";

    var texts = module.texts.es;

    var $host = $(control);

    var html = module.render('control', texts);
    $host.html(html);

    var pulldown = new PullDown(control);

    var ReactDOM = module.ReactDOM;
    var reactElement = createFnc.call(control);

    ReactDOM.render(
        reactElement,
        control.querySelector('.list'));

}
