function Toast() {
    "use strict";

    var texts = module.texts;

    var $toast;
    Object.defineProperty(this, '$toast', {
        'get': function () {
            return $toast;
        }
    });

    var toast, retry, close;
    var ready;
    var handler = beyond.toast;
    var MESSAGE_TYPE = handler.MESSAGE_TYPE;

    function setClass(cls) {
        $toast.removeClass('connection-error general-error general-message warning');
        $toast.addClass(cls);
    }

    function update() {

        if (!ready) {
            return;
        }

        var message = handler.message;
        if (!message) {
            toast.close();
            return;
        }

        if (message.type === MESSAGE_TYPE.CONNECTION_ERROR) {
            toast.text = module.texts.errors.connection;
            toast.duration = 0;
            close.hidden = true;
            retry.hidden = false;
            setClass('connection-error');
        }
        else {
            toast.text = message.text;
            toast.duration = message.duration;
            close.hidden = !!message.retry;
            retry.hidden = !message.retry;

            if (message.type === MESSAGE_TYPE.GENERAL_ERROR) {
                setClass('general-error');
            }
            else if (message.type === MESSAGE_TYPE.GENERAL_MESSAGE) {
                setClass('general-message');
            }
            else if (message.type === MESSAGE_TYPE.WARNING) {
                setClass('warning');
            }
        }

        Polymer.updateStyles();
        toast.open();

    }

    handler.bind('change', update);

    function onRetryButton() {

        // Avoid to call the onToastClosed method when the handler.retry is called
        // The handler.retry method will remove the message/s
        toast.removeEventListener('iron-overlay-closed', onToastClosed);

        handler.retry();
        toast.close();

        setTimeout(function () {
            toast.addEventListener('iron-overlay-closed', onToastClosed);
        }, 500);

    }

    function onCloseButton() {
        toast.close();
    }

    function onToastClosed() {
        handler.close();
    }

    function prepare() {

        var html = module.render('toast', texts);
        $toast = $(html);

        toast = $toast.get(0);
        toast.addEventListener('iron-overlay-closed', onToastClosed);

        retry = $toast.find('paper-button.retry').get(0);
        close = $toast.find('paper-button.done').get(0);
        retry.addEventListener('click', onRetryButton);
        close.addEventListener('click', onCloseButton);

        $('body').append($toast);
        setTimeout(function () {
            ready = true;
            update();
        }, 1000);

    }

    var dependencies = module.dependencies;
    dependencies.done(function () {
        prepare();
        setTimeout(update, 0);
    });

}

window.toast = new Toast();
