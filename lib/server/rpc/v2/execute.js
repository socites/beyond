/**
 * @param container The container of the module. Can be an application or a library.
 * @param runtime
 *  runtime.local
 *  runtime.offline
 *  runtime.environment
 *  runtime.paths
 *  @param context
 */

module.exports = function (container, runtime, context) {

    return require('async')(function* (resolve, reject, request) {

        let version = request.version;
        let moduleID = request.moduleID;
        let action = request.action;
        let id = request.id;
        let params = request.params ? request.params : {};

        if (!id) {
            reject('Action id not set');
            return;
        }
        if (typeof action !== 'string' || !action) {
            reject('Action not set');
            return;
        }
        if (typeof moduleID !== 'string' || typeof action !== 'string') {
            reject('Invalid module ID and/or action');
            return;
        }
        if (typeof version !== 'string' || !version) {
            reject('Version not set');
            return;
        }
        let module = moduleID.split('/');
        if (module.length < 2) {
            reject('Invalid module ID, the path is too short');
            return;
        }

        if (module[0] === 'libraries') {

            module.shift();
            let libraryName = module.shift();

            if (libraryName !== container.name) {
                reject('Invalid module [1]');
                return;
            }

            version = container.versions.items[version];
            if (!version) {
                reject(`Version "${version}" of the library "${container.name}" is not being hosted`);
                return;
            }

            module = module.join('/');
            if (module === 'main') module = '.';

            module = yield version.modules.module(module);

        }
        else if (module[0] === 'application') {

            if (!container) {
                reject({'message': 'invalid module [2]'});
                return;
            }

            module.shift();
            module = module.join('/');

            module = yield container.modules.module(module);

        }

        if (!module) {

            reject({'message': 'module not found'});
            return;

        }

        let response;
        try {
            yield module.initialise();
            response = yield module.execute(action, params, context);
        }
        catch (exc) {
            reject(exc);
            return;
        }

        resolve(response);

    });

};
