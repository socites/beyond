var ModuleStyles = function (module) {
    "use strict";

    this.push = function (styles, is) {

        // process css value
        var values = new Values(module);
        var resources = new Resources(module);
        styles = resources.process(styles);
        styles = values.process(styles);

        // append styles into the DOM
        var code = '';
        code += '<style module="' + module.ID + '"';
        code += is ? ' is="' + is + '"' : '';
        code += '>' + styles + '</style>';

        $('head').append(code);

    };

};
