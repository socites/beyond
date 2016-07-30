String.prototype.camelTo_ = function () {
    "use strict";

    return (this.replace(/\W+/g, '_')
        .replace(/([a-z\d])([A-Z])/g, '$1_$2')).toLowerCase();

};

String.prototype._ToCamel = function () {
    "use strict";

    return this.replace(/_([a-z])/g, function (m, w) {
        return w.toUpperCase();
    });

};

