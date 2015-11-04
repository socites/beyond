var Offline = function ($container) {
    "use strict";

    beyond.bind('offline', function () {
        "use strict";
        $container.show();
    });

    beyond.bind('online', function () {
        "use strict";
        $container.hide();
    });

};
