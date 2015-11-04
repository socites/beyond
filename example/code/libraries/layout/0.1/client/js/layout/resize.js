var resize = function ($viewport) {
    "use strict";

    var previous = {};
    return function () {

        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;

        // maintain the height of the viewport when the soft keyboard is shown
        if (width === previous.width && previous.height - height > 100) return;

        previous.width = width;
        previous.height = height;

        if (height > width) {
            $viewport.addClass('portrait');
            $viewport.removeClass('landscape');
        }
        else {
            $viewport.removeClass('portrait');
            $viewport.addClass('landscape');
        }

        $viewport.height(height);

    };

};
