function Template($container) {

    let control;
    Object.defineProperty(this, 'control', {'get': () => control});

    let $content;
    Object.defineProperty(this, '$content', {'get': () => $content});
    Object.defineProperty(this, 'content', {'get': () => ($content) ? $content.get(0) : undefined});

    let ready;
    Object.defineProperty(this, 'ready', {'get': () => !!ready});

    let callbacks = [];

    function render(texts, transitions) {

        let html = module.render('template', texts);

        $container
            .html(html)
            .addClass(transitions.DEFAULT)
            .addClass('page-control-template');

    }

    this.render = function (specs) {

        specs = (!specs) ? {} : specs;

        return new Promise(function (resolve) {

            module.dependencies.done(function (dependencies) {

                let transitions = dependencies.transitions;
                render(specs.texts, transitions);

                if (!specs.control) {
                    $container.addClass('no-control');
                }

                control = (specs.control) ? new Control($container, specs.control) : undefined;

                function done() {

                    ready = true;
                    for (let index in callbacks) {
                        callbacks[index]();
                    }
                    callbacks = undefined;
                    resolve();

                }

                if (control && control.valid) {
                    $content = control.$control;
                    control.done().then(done);
                }
                else {
                    $content = $('<div/>').addClass('content');
                    $container.append($content);
                    done();
                }

            });

        });

    };

    this.done = function (callback) {

        if (ready) {
            callback();
            return;
        }

        callbacks.push(callback);

    };

}
