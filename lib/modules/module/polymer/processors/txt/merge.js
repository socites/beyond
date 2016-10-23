/*
 * Recursively merge properties of two objects
 * @param obj1 will take the values of obj1 and obj2
 */
var merge = function (obj1, obj2) {
    "use strict";

    for (let prop in obj2) {

        if (typeof obj1[prop] === 'object' && typeof obj2[prop] === 'object') {
            merge(obj1[prop], obj2[prop]);
        }
        else {
            obj1[prop] = obj2[prop];
        }

    }

    return obj1;

};

module.exports = merge;
