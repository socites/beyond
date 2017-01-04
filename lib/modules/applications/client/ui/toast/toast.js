function Toast() {
    "use strict";

    var texts = module.texts.es;

    var $container;
    Object.defineProperty(this, '$container', {
        'get': function () {
            return $container;
        }
    });

    var toast, button;
    var ready;
    var handler = beyond.errorHandler;

    function update() {

        if (!ready) {
            return;
        }

        if (handler.display) {
            toast.open();
        }
        else {
            toast.close();
        }

    }

    handler.bind('change', update);

    function onRetryButton() {
        handler.retry();
        toast.close();
    }

    function prepare() {

        var html = module.render('toast', texts);
        $container = $(html);

        toast = $container.get(0);
        button = $container.find('paper-button').get(0);

        button.addEventListener('click', onRetryButton);

        $('body').append($container);

        ready = true;

    }

    var dependencies = module.dependencies;
    dependencies.done(function () {
        prepare();
        setTimeout(update, 0);
    });

}

window.toast = new Toast();
