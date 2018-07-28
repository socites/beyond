let Texts = function (module) {
    'use strict';

    this.copy = function () {

        let texts = {};
        $.extend(true, texts, this);

        delete texts.copy;
        return texts;

    };

};
