String.prototype.camelTo_ = function () {
    "use strict";

    return (this.replace(/\W+/g, '_')
        .replace(/([a-z0-9\d])([A-Z0-9])/g, '$1_$2')).toLowerCase();

};

String.prototype._ToCamel = function () {
    "use strict";

    return this.replace(/_([a-z0-9])/g, function (m, w) {
        return w.toUpperCase();
    });

};

