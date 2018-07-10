module.exports = function (socket, io, ns) {

    Object.defineProperty(this, 'socket', {
        'get': function () {
            return socket;
        }
    });
    Object.defineProperty(this, 'io', {
        'get': function () {
            return io;
        }
    });
    Object.defineProperty(this, 'ns', {
        'get': function () {
            return ns;
        }
    });

};
