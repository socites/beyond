var Texts = function (module) {
    "use strict";

    this.copy = function () {

        var texts = {};
        $.extend(true, texts, this);

        delete texts.copy;
        return texts;

    };

};
