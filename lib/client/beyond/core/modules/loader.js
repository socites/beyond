/**
 * Module loader.
 *
 * @param module {object} The module object.
 * @param callback {function} The function called by the bundle to be notified when it is loaded.
 * @constructor
 */
function ModuleLoader(module, callback) {

    let loaded;

    Object.defineProperty(this, 'loaded', {'get': () => !!loaded});
    callback.callback = function () {
        loaded = 1;
    };

    this.require = async function () {

        return new Promise(function (resolve, reject) {
            require([module.src], resolve, reject);
        });

    };

}
