let autoincrement = 0;
let pending = new Map; // Pending actions

const Action = module => function (path, params) {

    /**
     * Execution policy
     * @type {Readonly<{COMMUNICATION_ERRORS: number, NONE: number, DEFAULT: number}>}
     * @deprecated
     */
    const POLICY = Object.freeze({
        'COMMUNICATION_ERRORS': 1,
        'NONE': 2,
        'DEFAULT': 2
    });
    Object.defineProperty(this, 'POLICY', {'get': () => POLICY});

    const ERROR_CODE = Object.freeze({
        'NO_ERROR': 0,
        'CANCELED': 1
    });
    Object.defineProperty(this, 'ERROR_CODE', {'get': () => ERROR_CODE});

    const id = ++autoincrement;
    pending.set(id, this);

    const MAX_RETRIES = 1000;
    const TIME_OUT = 3000;

    const request = {
        'moduleID': module.ID,
        'action': path,
        'params': params,
        'version': module.library ? module.library.version : beyond.params.version,
        'id': id
    };

    let executed, executing, timer;
    let attempts = 0;

    Object.defineProperty(this, 'executing', {'get': () => !!executing});
    Object.defineProperty(this, 'executed', {'get': () => !!executed});

    let ack;
    Object.defineProperty(this, 'ack', {'get': () => !!ack});

    function send(socket) {

        if (attempts && !socket.connected) return;

        const params = ack ? {
            'id': id,
            'retry': true,
            'attempts': attempts
        } : request;

        socket.emit('rpc-v2', params, () => ack = true);

        attempts++;

    }

    let execute = socket => new Promise((resolve, reject) => {

        const channel = `response-v2-${id}`;

        const onConnect = () => {
            clearTimeout(timer);
            send(socket);
            monitor();
        };

        const onresponse = response => {

            executed = true;
            executing = false;

            clearTimeout(timer);
            beyond.removeMessage('rpc-retrying-connection');

            socket.off(channel, onresponse);
            response.error ? reject(response.error) : resolve(response.message);

        };

        socket.on(channel, onresponse);

        // Retry sending request if response not received
        function monitor() {

            timer = setTimeout(function () {

                if (attempts >= MAX_RETRIES) return; // Do not continue trying to execute the action

                beyond.showMessage({
                    'id': 'rpc-retrying-connection',
                    'text': 'Reintentando conexión',
                    'duration': 0
                });

                monitor();
                send(socket);

            }, TIME_OUT);

        }

        monitor();
        send(socket);
        socket.on('connect', onConnect);

    });

    /**
     * The promise of the action
     */
    const promise = Promise.pending();
    Object.defineProperty(this, 'promise', {'get': () => promise});

    /**
     * Cancel action support
     */
    let cancelled;
    Object.defineProperty(this, 'cancelled', {'get': () => !!cancelled});

    this.cancel = function () {

        if (executed || cancelled) return; // Action already cancelled or executed
        cancelled = true;

        let error = Object.assign(new Error('Action cancelled'), {'code': ERROR_CODE.CANCELED});
        promise.reject(error);

    };

    this.execute = (specs) => {

        if (executing || executed) {
            console.error('Execute method already called', request);
            return;
        }
        executing = true;

        specs = specs ? specs : {};
        const callback = specs.callback;

        module.socket
            .then(socket => execute(socket))
            .then(response => {

                if (cancelled) return;

                if (this.onResponse) this.onResponse(response);
                if (callback) callback(response);
                promise.resolve(response);

            })
            .catch(error => {

                if (this.onError) this.onError(error);
                if (callback) callback(undefined, error);
                promise.reject(error);

            });

        promise.cancel = () => this.cancel();
        promise.promise = promise;

        // Avoid to show Uncaught error when the action is catching errors with the onError handler
        if (typeof this.onError === 'function') {
            promise.catch(() => null);
        }

        return promise;

    };

};
