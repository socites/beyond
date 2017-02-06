function Messages() {
    "use strict";

    var map = new Map();
    var ordered = [];

    Object.defineProperty(this, 'keys', {
        'get': function () {
            return ordered.slice();
        }
    });

    this.set = function (message) {

        if (typeof message !== 'object') {
            console.log(message);
            throw new Error('Message parameter is invalid');
        }

        var id = message.id;
        if (typeof id !== 'string') {
            console.log(message);
            throw new Error('Invalid message id');
        }

        map.set(id, message);

        var index = ordered.indexOf(id);
        if (index !== -1) {
            ordered.splice(index, 1);
        }

        ordered.push(id);

    };

    this.get = function (id) {

        return map.get(id);

    };

    this.typeExists = function (type) {

        var exists = false;
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

        var id = (typeof message === 'object') ? message.id : message;
        if (typeof id !== 'string') {
            throw new Error('Message id is invalid');
        }

        map.delete(id);

        var index = ordered.indexOf(id);
        if (index !== -1) {
            ordered.splice(index, 1);
        }

    };

    Object.defineProperty(this, 'first', {
        'get': function () {
            return map.get(ordered[0]);
        }
    });

}
