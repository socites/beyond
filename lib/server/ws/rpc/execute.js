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
    'use strict';

    return function (request) {

        return new Promise(async function (resolve, reject) {

            let moduleID = request.moduleID;
            let action = request.action;
            let params = request.params;
            let version = request.version;
            if (!params) params = {};

            if (typeof action !== 'string' || !action) {
                reject('action not set');
                return;
            }

            if (typeof moduleID !== 'string' || typeof action !== 'string') {
                reject('invalid module ID and/or action');
                return;
            }

            if (typeof version !== 'string' || !version) {
                reject('version not set');
                return;
            }

            let module = moduleID.split('/');
            if (module.length < 2) {
                reject('invalid module ID, the path is too short');
                return;
            }

            if (module[0] === 'libraries') {

                module.shift();
                let libraryName = module.shift();

                if (libraryName !== container.name) {
                    reject('invalid module [1]');
                    return;
                }

                version = container.versions.items[version];
                if (!version) {
                    reject('version "' + version + '" of the library "' + container.name + '" is not being hosted');
                    return;
                }

                module = module.join('/');
                if (module === 'main') module = '.';

                module = await version.modules.module(module);

            }
            else if (module[0] === 'application') {

                if (!container) {
                    reject({'message': 'invalid module [2]'});
                    return;
                }

                module.shift();
                module = module.join('/');

                module = await container.modules.module(module);

            }

            if (!module) {

                reject({'message': 'module not found'});
                return;

            }

            await module.initialise();
            return await module.execute(action, params, context);

        });

    };

};
