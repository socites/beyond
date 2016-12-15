// Convert strings to an integer hash
String.prototype.hashCode = function () {

    var hash = 0, i = 0, len = this.length, chr;

    while (i < len) {
        hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
    }

    hash = (hash + 2147483647) + 1;

    return hash;

};
