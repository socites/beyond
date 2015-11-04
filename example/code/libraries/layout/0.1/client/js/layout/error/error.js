var ErrorController = function () {
    "use strict";

    var $container = $('#error');

    this.show = function (code, message, icon) {

        if (typeof code !== 'undefined') this.code = code;
        if (typeof message !== 'undefined') this.message = message;
        if (typeof icon !== 'undefined') this.icon = icon;

        $container.show();

    };

    var hide = function () {
        $container.hide();
    };

    this.hide = hide;

    Object.defineProperty(this, 'code', {
        'set': function (value) {
            $container.children('.code').html(value);
        }
    });

    Object.defineProperty(this, 'icon', {
        'set': function (value) {
            $container.children('.icon').html(value);
        }
    });

    Object.defineProperty(this, 'message', {
        'set': function (value) {
            $container.children('.message').html(value);
        }
    });

    $container.children('.continue').click(function () {

        hide();
        beyond.navigate(undefined, '/entries');

    });

};

var setErrorController = function (layout) {
    "use strict";

    var error = new ErrorController();
    layout.error = error;

    beyond.navigation.bind('error', function (code, message) {
        "use strict";

        error.show(code, message);

    });

};
