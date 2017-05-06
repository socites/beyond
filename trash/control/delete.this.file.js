function ControlInstance(element) {
    "use strict";

    var onSNAChanged = Delegate(this, function () {

        if (!sna.state) {
            return;
        }

        for (var name in specs.properties) {

            var spec = specs.properties[name];
            if (spec.value) {

                var value = sna.state[spec.value];

                if (spec.notify) {
                    var method = '_set' +
                        spec.name.substr(0, 1).toUpperCase() +
                        spec.name.substr(1);

                    this[method](value);
                }
                else {
                    this[name] = value;
                }

            }

        }

    });

    var sna;
    Object.defineProperty(this, 'sna', {
        'get': function () {
            return sna;
        },
        'set': function (value) {

            if (sna) {
                throw new Error('sna is already defined');
            }
            sna = value;

            sna.bind('change', onSNAChanged);

        }
    });

    function onMethodExecuted(name) {

        if (!sna) {
            throw new Error('sna not set, wait for control to be ready');
        }

        if (typeof sna[name] !== 'function') {
            throw new Error('sna must implement method "' + name + '"');
        }

        var args = [].slice.call(arguments);
        args.shift();

        sna[name].apply(sna, args);

    }

}
