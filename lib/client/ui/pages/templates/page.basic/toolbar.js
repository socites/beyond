function Toolbar($container, control) {

    let back = $container.find('paper-toolbar .back').get(0);
    let refresh = $container.find('paper-toolbar .refresh').get(0);
    let spinner = $container.find('paper-toolbar paper-spinner').get(0);

    refresh.addEventListener('click', function () {
        if (typeof control.refresh === 'function') control.refresh();
    });

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
        spinner.active = (control.fetching || control.publishing || !!control.processing);
    }

    control.addEventListener('fetching-changed', update);
    control.addEventListener('publishing-changed', update);
    control.addEventListener('processing-changed', update);
    update();

}
