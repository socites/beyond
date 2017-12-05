function Actions(controller, properties) {
    "use strict";

    this.navigate = function (event) {

        var $target = $(event.currentTarget);
        var url = $target.data('url');

        beyond.navigate(url);

    };

}
