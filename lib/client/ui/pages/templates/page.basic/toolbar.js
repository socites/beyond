function Toolbar($container, control) {
    "use strict";

    var back = $container.find('paper-toolbar .back').get(0);
    var refresh = $container.find('paper-toolbar .refresh').get(0);
    var spinner = $container.find('paper-toolbar paper-spinner').get(0);

    back.addEventListener('click', function () {

        if (typeof control.back !== 'function') {
            beyond.back();
            return;
        }

        control.back()
            .then(function (exit) {
                if (!exit) {
                    return;
                }

                beyond.back();
            });

    });

    function update() {
        spinner.active = (!!control.fetching || !!control.publishing || !!control.processing);
    }

    control.addEventListener('fetching-changed', update);
    control.addEventListener('publishing-changed', update);
    control.addEventListener('processing-changed', update);
    update();

}
