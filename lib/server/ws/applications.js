/**
 * Iterate over applications and start receiving connections.
 *
 * @param io
 * @param applications
 * @param runtime
 */
module.exports = function (io, applications, runtime) {

    if (!applications.length) {
        return;
    }

    console.log('listening applications');

    for (let application of applications.keys) {

        application = applications.items[application];

        if (!application.connect) {
            continue;
        }

        console.log(`\tlistening application "${application.name}"`);
        require('./namespace.js')(io, application, `/applications/${application.name}`);

    }

    if (applications.length) {
        console.log('\n');
    }

};
