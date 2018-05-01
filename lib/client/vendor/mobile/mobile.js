$(document).ready(function () {
    "use strict";

    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) {
        $('body > .topbar').addClass('ios');
        $('body > .app-container').addClass('ios');
    }

    if (beyond.params.fastClick) {

        require(['fastclick'], function (FastClick) {
            FastClick.attach(document.body);
        });

    }

});
