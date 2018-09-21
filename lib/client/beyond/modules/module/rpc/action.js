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

    let executed, executing, timer;
    let attempts = 0;

    Object.defineProperty(this, 'executing', {'get': () => !!executing});
    Object.defineProperty(this, 'executed', {'get': () => !!executed});

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

            executed = true;
            executing = false;

            clearTimeout(timer);
            beyond.removeMessage('rpc-retrying-connection');

            socket.off(channel, response);
            if (response.error) {
                reject(response.error);
            }
            else {
                resolve(response.message);
            }

        };

        socket.on(`response-v2-${id}`, onresponse);

        // Retry sending request if response not received
        function monitor() {

            timer = setTimeout(function () {

                if (attempts >= MAX_RETRIES) {
                    reject(new Error('The maximum number of retries was reached'));
                    return;
                }

                beyond.showMessage({
                    'id': 'rpc-retrying-connection',
                    'text': 'Reintentando conexión',
                    'duration': 0
                });

                monitor();
                send(socket);

            }, TIME_OUT + (attempts * 2000));

        }

        monitor();
        send(socket);

    });

    /**
     * The promise of the action
     */
    let promise = Promise.pending();

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
        let callback = specs.callback;

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

        // Avoid to show Uncaught error when the action is catching errors with the onError handler
        if (typeof this.onError === 'function') {
            promise.catch(() => null);
        }

        return promise;

    };

};
