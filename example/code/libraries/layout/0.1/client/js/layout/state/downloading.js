var Downloading = function ($container) {
    "use strict";

    this.show = function () {
        $container.show();
    };

    this.hide = function () {
        $container.hide();
    };

    Object.defineProperty(this, 'text', {
        'get': function () {
            return $container.children('.text').text();
        },
        'set': function (value) {
            $container.children('.text').text(value);
        }
    });

};
