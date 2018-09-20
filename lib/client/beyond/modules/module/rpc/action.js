let autoincrement = 0;

let Action = (module) => function (path, params) {

    /**
     * Execution policy
     * @type {Readonly<{COMMUNICATION_ERRORS: number, NONE: number, DEFAULT: number}>}
     * @deprecated
     */
    let POLICY = Object.freeze({
        'COMMUNICATION_ERRORS': 1,
        'NONE': 2,
        'DEFAULT': 2
    });
    Object.defineProperty(this, 'POLICY', {'get': () => POLICY});

    let ERROR_CODE = Object.freeze({
        'NO_ERROR': 0,
        'CANCELED': 1
    });
    Object.defineProperty(this, 'ERROR_CODE', {'get': () => ERROR_CODE});

    let id = ++autoincrement;
    let MAX_RETRIES = 10;
    let TIME_OUT = 5000;

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

        if (attempts) {
            console.log(`Retrying [${attempts}] to execute action "${path}"`);
        }

        attempts++;
        socket.emit('rpc-v2', request);

    }

    let execute = (socket) => new Promise((resolve, reject) => {

        let channel = `response-v2-${id}`;

        let onresponse = response => {

            clearTimeout(timer);
            socket.off(channel, response);
            resolve(response.message);

        };

        socket.on(`response-v2-${id}`, onresponse);

        // Retry sending request if response not received
        timer = setInterval(function () {

            if (attempts >= MAX_RETRIES) {
                reject(new Error('The maximum number of retries was reached'));
                return;
            }

            beyond.showMessage({
                'id': 'rpc-retrying-connection',
                'text': 'Reintentando conexión'
            });

            send(socket);

        }, TIME_OUT + (attempts * 2000));

        send(socket);

    });

    this.execute = () => new Promise((resolve, reject) => {

        if (executed) {
            console.error('Action already executed', request);
            return;
        }
        executed = true;

        module.socket
            .then(socket => execute(socket))
            .then(response => {
                if (this.onResponse) this.onResponse(response);
                resolve(response);
            })
            .catch(error => {
                if (this.onError) this.onError(error);
                reject(error);
            });

    });

};
