let autoincrement = 0;

let Action = (module) => function (path, params) {

    let id = ++autoincrement;
    let MAX_RETRIES = 5;

    let request = {
        'moduleID': module.ID,
        'action': path,
        'params': params,
        'version': module.library ? module.library.version : beyond.params.version,
        'id': id
    };

    let executed, timer;
    let attempts = 0;

    function send(socket) {
console.log('sending', attempts);
        attempts++;
        socket.emit('rpc-v2', request);

    }

    let execute = (socket) => new Promise((resolve, reject) => {

        let channel = `response-v2-${id}`;

        let onresponse = response => {

            console.log(response);
            clearTimeout(timer);
            socket.off(channel, response);
            resolve(response);

        };

        socket.on(`response-v2-${id}`, onresponse);

        // Retry sending request if response not received
        timer = setInterval(function () {

            if (attempts >= MAX_RETRIES) {
                reject(new Error('The maximum number of retries was reached'));
                return;
            }

            send(socket);

        }, 5000);

        send(socket);

    });

    this.execute = async function () {

        if (executed) {
            console.error('Action already executed', request);
            return;
        }
        executed = true;

        let socket = await module.socket;
        return await execute(socket);

    };

};
