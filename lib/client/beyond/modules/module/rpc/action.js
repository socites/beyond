let autoincrement = 0;

let Action = (module) => function (path, params) {

    let id = ++autoincrement;

    let request = {
        'moduleID': module.ID,
        'action': path,
        'params': params,
        'version': module.library ? module.library.version : beyond.params.version,
        'id': id
    };

    this.execute = async function () {

        let socket = await module.socket;
        let channel = `response-v2-${id}`;

        let response = response => {
            console.log(response);
            socket.off(channel, response);
        };

        socket.on(`response-v2-${id}`, response);

        socket.emit('rpc-v2', request, function (ack) {
            console.log('ack', ack);
        });

    };

};
