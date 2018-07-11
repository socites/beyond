/**
 * Iterate over applications and start receiving connections.
 *
 * @param io
 * @param libraries
 * @param runtime
 */
module.exports = function (io, libraries, runtime) {

    if (!libraries.length) {
        return;
    }

    console.log('listening libraries');

    for (let library of libraries.keys) {

        library = libraries.items[library];

        if (!library.connect) {
            continue;
        }

        console.log(`\tlistening library "${library.name}"`);
        require('./namespace.js')(io, application, `/libraries/${library.name}`);

    }

    if (libraries.length) {
        console.log('\n');
    }

};
