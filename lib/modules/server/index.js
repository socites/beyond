module.exports = function (container, config, runtime) {

    let service;

    this.listen = global.async(async function (resolve, reject, ions) {


        resolve();

    });

    this.connect = global.async(async function (resolve, reject, context) {

        if (!service.code || typeof service.code.connection !== 'function') {
            resolve();
            return;
        }

        try {
            await service.code.connection(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service connection error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);

        }

        resolve();

    });

    this.disconnect = global.async(async function (resolve, reject, context) {

        if (!service.code || typeof service.code.disconnect !== 'function') {
            return;
        }

        try {
            await service.code.disconnect(context);
        }
        catch (exc) {

            console.log('\n');
            console.log('service disconnect error on library"'.red + (name).red.bold);
            console.log(exc.stack);
            reject(exc);
            return;

        }

        resolve();

    });

};
