function Messages() {

    let map = new Map();
    let ordered = [];

    Object.defineProperty(this, 'keys', {'get': () => ordered.slice()});

    this.set = function (message) {

        if (typeof message !== 'object') {
            console.log(message);
            throw new Error('Message parameter is invalid');
        }

        let id = message.id;
        if (typeof id !== 'string') {
            console.log(message);
            throw new Error('Invalid message id');
        }

        map.set(id, message);

        let index = ordered.indexOf(id);
        if (index !== -1) {
            ordered.splice(index, 1);
        }

        ordered.push(id);

    };

    this.has = (id) => map.has(id);
    this.get = (id) => map.get(id);

    this.typeExists = function (type) {

        let exists = false;
        map.forEach(function (message) {
            if (exists) {
                return;
            }
            if (message.type === type) {
                exists = true;
            }
        });

        return exists;

    };

    this.delete = function (message) {

        let id = (typeof message === 'object') ? message.id : message;
        if (typeof id !== 'string') {
            throw new Error('Message id is invalid');
        }

        map.delete(id);

        let index = ordered.indexOf(id);
        if (index !== -1) {
            ordered.splice(index, 1);
        }

    };

    Object.defineProperty(this, 'first', {'get': () => map.get(ordered[0])});

}
