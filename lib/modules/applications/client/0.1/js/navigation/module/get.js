var moduleGet = function (navigation, controls) {
    "use strict";

    return function (pathname, state, callback) {

        var control = controls.control(pathname);

        if (control) update(control, state, function () {
            callback(control, state);
        });
        else moduleInstantiate(pathname, state, function (error, control, state) {

            if (error) {
                callback(error);
                return;
            }
            else {

                callback(control, state);
                if (control.type === 'master') {

                    controls.masters.push(control);

                }
                else {

                    controls.masters.push(control.master);

                }

            }

        });

    };

};
