/*globals Channels, Events, Channel, socket, beyond*/
var Beyond = function (beyond) {
    "use strict";

    var vm = this;
    var events = new Events({'bind': vm});

    vm.hosts = beyond.hosts;
    vm.params = beyond.params;
    vm.css = {'values': beyond.css.values};
    vm.overwrites = beyond.overwrites;

    vm.loader = new Loader(events);

    var channels = new Channels(vm);

    vm.libraries = new Libraries(vm, channels);
    vm.modules = new Modules(events);
    vm.Module = Module;

    vm.routes = new Routes(beyond.routes);

    vm.navigation = new Navigation(vm);
    Object.defineProperty(vm, 'pathname', {
        'get': function () {
            return vm.navigation.pathname;
        }
    });
    vm.navigate = function () {
        vm.navigation.navigate.apply(vm.navigation, arguments);
    };

    var online;
    Object.defineProperty(vm, 'online', {
        'get': function () {
            return online && socket.connected;
        }
    });
    events.bind('online', function () {
        online = true;
    });
    events.bind('offline', function () {
        online = false;
    });

    Object.defineProperty(vm, 'connected', {
        'get': function () {
            return socket.connected;
        }
    });

    vm.start = function () {

        Channel(channels, vm, vm.hosts.application.ws);

        events.trigger('start');
        delete vm.start;

    };

};

window.beyond = new Beyond(beyond);
