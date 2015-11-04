(function (browser) {
    "use strict";

    var agent = navigator.userAgent.toLowerCase();

    browser.mozilla = /mozilla/.test(agent) && !/webkit /.test(agent);
    browser.webkit = /webkit/.test(agent);
    browser.opera = /opera/.test(agent);
    browser.msie = /msie/.test(agent);

})(window.browser = {});
