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

    return async function (request) {

        let moduleID = request.moduleID;
        let action = request.action;
        let params = (request.params) ? request.params : {};
        let version = request.version;

        if (typeof action !== 'string' || !action) {
            throw 'Action not set';
        } else if (typeof moduleID !== 'string' || typeof action !== 'string') {
            throw 'Invalid module ID and/or action';
        } else if (typeof version !== 'string' || !version) {
            throw 'Version not set';
        }

        let module = moduleID.split('/');
        if (module.length < 2) {
            throw 'Invalid module ID, the path is too short';
        }

        if (module[0] === 'libraries') {

            module.shift();
            let libraryName = module.shift();

            if (libraryName !== container.name) {
                throw 'Invalid module [1]';
            }

            version = container.versions.items[version];
            if (!version) {
                throw `Version "${version}" of the library "${container.name}" is not being hosted`;
            }

            module = module.join('/');
            module = (module === 'main') ? '.' : module;

            module = await version.modules.module(module);

        }
        else if (module[0] === 'application') {

            if (!container) {
                throw 'Invalid module [2]';
            }

            module.shift();
            module = module.join('/');

            module = await container.modules.module(module);

        }

        if (!module) {
            throw 'Module not found';
        }

        // Initialise module before executing action
        await module.initialise();

        // Execute action
        return await module.execute(action, params, context);

    };

};
