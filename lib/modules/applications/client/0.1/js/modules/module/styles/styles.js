var ModuleStyles = function (module) {
    "use strict";

    var ID;
    Object.defineProperty(this, 'ID', {
        'get': function () {

            if (ID) return ID;

            ID = module.ID;
            ID = ID.replace(/\//g, '\\/').replace(/:/g, '-');
            return ID;

        }
    });

    this.push = function (styles, is) {

        // check another style with the same ID
        var $previous = $('#' + this.ID);
        if ($previous.length) {
            console.warn('styles of module "' + this.ID + '" was already registered');
            return;
        }

        // process css value
        var values = new Values(module);
        var resources = new Resources(module);
        styles = resources.process(styles);
        styles = values.process(styles);

        // append styles into the DOM
        var $style = $('<style />');
        $style.html(styles);
        $style.attr('id', this.ID);

        if (is) $style.attr('is', is);
        $('head').append($style);

    };

};
