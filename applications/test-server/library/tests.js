function Tests() {
    "use strict";

    var params = {'big': '', 'max': ''};
    var i;
    for (i = 0; i < 1000000; i++) {
        params.big += '!';
    }
    for (i = 0; i < 4000; i++) {
        params.max += '!';
    }

    var count = {'ok': 0, 'errors': 0};

    this.execute = function (action, big) {

        var action = new module.Action(action, (big) ? params.big : params.max);
        action.onResponse = function (response) {
            count.ok++;
            console.log(count.ok, response);
        };
        action.onError = function (response) {
            count.errors++;
            console.log(count.errors, 'Error:', response);
        };
        action.execute();

    };

    this.run = function (action, count, big) {

        for (var i = 0; i < count; i++) {
            this.execute(action, big);
            console.log('execute', i);
        }

    };

}
