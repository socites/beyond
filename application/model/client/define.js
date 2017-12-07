define(['beyond.model'], function (model) {
    "use strict";

    var beyond = new Beyond(model);

    console.log('Beyond model is being exposed as window._b.\n' +
        'Use it only from the development console.');
    window._b = beyond;

    return beyond;

});
