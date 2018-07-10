/**
 * Iterate over applications and start receiving connections.
 *
 * @param io
 * @param applications
 */
module.exports = function (io, applications) {

    if (!applications.length) {
        return;
    }

    console.log('listening applications');

    for (let application of applications.keys) {

        application = applications.items[application];

        if (!application.connect) {
            continue;
        }

        console.log('\tlistening application ' + (application.name).bold);

        require('./namespace.js')(io, application, `/applications/${application.name}`);

    }

    if (applications.length) {
        console.log('\n');
    }

};
