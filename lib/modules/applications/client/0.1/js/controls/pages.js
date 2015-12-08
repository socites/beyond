function Pages() {
    "use strict";

    Modules.call(this);

    // bring a module regardless of whether it is a control or a page
    // specs can specify a moduleID or a pathname
    this.module = function (specs) {

        var moduleID, pathname;
        if (specs.moduleID) moduleID = specs.moduleID;
        else pathname = specs.pathname;

        var keys = this.keys;
        for (var i in keys) {

            var key = keys[i];
            var page = this.items[key];

            if (pathname && page.pathname === pathname) return page;
            else if (moduleID && page.moduleID === pathname) return page;

            var control = page.control(specs);
            if (control) return control.page;

        }

    };

};
