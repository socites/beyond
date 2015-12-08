// it is not enough to load the required module;
// it is also necessary to verify if it is a slave control, in which case,
// it is also needed to load its corresponding master
var moduleInstantiate = function (moduleGet, pathname, state, callback) {

    moduleLoad(pathname, state, function (error, moduleID, Controller, type, state) {

        if (error) {
            callback(error);
            return;
        }

        var control, controller;
        var specs = {'pathname': pathname, 'moduleID': moduleID};

        switch (type) {

            case 'master':

                control = new Master(specs);
                controller = new Controller(control);
                control.controller = controller;
                break;

            case 'slave':

                var active = beyond.navigation.active;
                var master;

                if (active && active.type === 'master') {
                    master = active;
                }
                else if (active && active.type === 'slave') {
                    if (active.master) master = active.master;
                }

                control = new Slave(specs, master);
                controller = new Controller(control);
                control.controller = controller;
                break;

        }

        if (typeof controller.show !== 'function') {

            callback('Controller does not expose a show method');
            return;

        }

        switch (type) {

            case 'master':

                callback(undefined, control, state);
                break;

            case 'slave':

                if (control.orphan) {
                    callback('Slave control did not set its master');
                    return;
                }

                // find out the master control
                master = control.master;
                if (typeof master === 'string') master = {'pathname': master};
                if (!master || !master.pathname) {
                    callback('Slave control has set an invalid master');
                    return;
                }

                moduleGet(master.pathname, master.state, function (error, master, state) {

                    if (error) {
                        callback('Error getting master control: ' + error);
                        return;
                    }

                    if (!master.type === 'master') {
                        callback('Slave control has specified another slave control as its master');
                        return;
                    }

                    master.slaves.push(control);
                    control.master = master;

                    callback(undefined, control, state);

                });

                break;

        }

    });

};
