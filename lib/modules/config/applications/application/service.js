/**
 * The service configuration handler.
 *
 * @param application
 * @param service
 * @param serverServicesConfig The configuration of the services in the server
 *
 * @returns {{path: *, config: *, serverConfig: {}|undefined}|*}
 */
module.exports = function (application, service, serverServicesConfig) {

    service = (typeof service === 'string') ? {'path': service} : service;

    if (!service) {
        return;
    }

    let fs = require('fs');

    if (!service.path) {
        throw new Error(`Service path not specified on application "${application.name}"`);
    }

    // Check that service directory exists
    service.path = require('path').resolve(dirname, service.path);
    if (!fs.existsSync(service.path) || !fs.statSync(service.path).isDirectory()) {

        let message = `Service directory "${service.path}" ` +
            `specified on library "${application.name}" does not exist.`.red;
        throw new Error(message);

    }

    // Check that service configuration file exists
    if (service.config) {

        service.config = require('path').resolve(dirname, service.config);
        if (!fs.existsSync(service.config) || !fs.statSync(service.config).isFile()) {
            let message = `Service configuration file "${service.config}" ` +
                `specified on library "${application.name}" does not exist.`.red;
            throw new Error(message);
        }

    }

    // Set the configuration of the service that is overwritten by server configuration
    let serverConfig = serverServicesConfig[application.name];
    serverConfig = (typeof serverConfig === 'object') ? serverConfig : undefined;
    serverConfig = (serverConfig) ? JSON.parse(JSON.stringify(serverConfig)) : {};

    for (let property in serverServicesConfig.common) {

        if (!serverServicesConfig.common.hasOwnProperty(property)) continue;

        if (serverConfig[property]) {
            continue;
        }

        let value = serverServicesConfig.common[property];
        serverConfig[property] = JSON.parse(JSON.stringify(value));

    }

    return {
        'path': service.path,
        'config': service.config,
        'serverConfig': serverConfig
    };

};
