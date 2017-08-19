String.prototype.camelTo_ = function () {
    "use strict";

    return this.replace(/([A-Z]|\d+)/g, function ($1) {
        return "_" + $1.toLowerCase();
    });

};

String.prototype._ToCamel = function () {
    "use strict";

    return this.replace(/_([a-z0-9])/g, function (m, w) {
        return w.toUpperCase();
    });

};

