define(['beyond.model'], function (model) {
    "use strict";

    module.model = model;

    var beyond = new Beyond();

    console.log('Beyond model is being exposed as window._b.\n' +
        'Use it only from the development console.');
    window._b = beyond;

    return beyond;

});
