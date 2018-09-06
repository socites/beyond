// Connection handler
module.exports = function (container, runtime, context) {

    let socket = context.socket;
    if (!socket) {
        console.error(`Socket not found on container: "${container.name}"`);
        return;
    }

    require('./v1')(container, runtime, context);
    require('./v2')(container, runtime, context);

};
