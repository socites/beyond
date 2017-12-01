function Screen(screenId) {
    "use strict";

    var events = new Events({'bind': this});

    var data;
    Object.defineProperty(this, 'data', {
        'get': function () {
            return data;
        }
    });

    this.join = function () {

        function onUpdateReceived(params) {

            data = params;
            events.trigger('update', data);

        }

        module.socket(function (socket) {

            socket.off('update', onUpdateReceived);
            socket.on('update', onUpdateReceived);

        });

        return new Promise(function (resolve, reject) {

            var action = new module.Action('screens/join', {'screenId': screenId});
            action.onResponse = function (response) {
                resolve(response);
            };
            action.onError = function (error) {
                resolve(error);
            };
            action.execute();

        });

    };

    this.get = function () {

        return new Promise(function (resolve, reject) {

            var action = new module.Action('screens/get', {'screenId': screenId});
            action.onResponse = function (response) {

                data = response;
                resolve(response);

            };
            action.onError = function (error) {
                reject(error);
            };
            action.execute();

        });

    };

}
