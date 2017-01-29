function Dashboard() {
    "use strict";

    this.update = function (screenId, template, data) {

        return new Promise(function (resolve, reject) {

            var params = {
                'screen': screenId,
                'template': template,
                'data': data
            };

            var action = new module.Action('screens/update', params);
            action.onResponse = function (response) {
                resolve(response);
            };
            action.onError = function (error) {
                reject(error);
            };
            action.execute();

        });

    };

}
