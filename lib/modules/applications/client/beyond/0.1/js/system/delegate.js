window.Delegate = function () {
    "use strict";

    var params = Array.prototype.slice.call(arguments);
    var context = params.shift();
    var method;

    if (typeof context === 'object') {

        method = params.shift();

        if (typeof method !== 'function') {

            if (typeof method !== 'string') {
                console.error('invalid delegate function, it must be a method of the object');
                return;
            }
            else if (typeof context[method] !== 'function') {
                console.error(
                    'DELEGATE DECLARATION ERROR: method "' +
                    method + '" does not exist in object', context);
                return;
            }

        }

    }
    else if (typeof context === 'function') {
        method = context;
        context = undefined;
    }
    else {
        console.error('ERROR: it was expected an object or a function as the first parameter');
        return;
    }

    if (typeof method === 'function') {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args = params.concat(args);
            return method.apply(context, args);
        };
    }
    else {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args = params.concat(args);
            return context[method].apply(context, args);
        };
    }

};
