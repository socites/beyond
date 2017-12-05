function Applications() {
    "use strict";

    var entries;
    Object.defineProperty(this, 'entries', {
        'get': function () {
            return entries;
        }
    });

}
