define(function () {
    "use strict";

    var factories = new Factories();
    module.factories = factories;

    return {
        'Collection': Collection,
        'Item': Item,
        'factories': factories
    };

});
