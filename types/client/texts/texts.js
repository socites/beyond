let Texts = function (module) {

    this.copy = function () {

        let texts = {};
        $.extend(true, texts, this);

        delete texts.copy;
        return texts;

    };

};
