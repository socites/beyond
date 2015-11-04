beyond.navigation.bind('error', function (code, message) {

    if (code) {

        layout.error.icon = '&#xf127;';
        layout.error.code = code;

        if (!message) message = '';
        if (code === '404') message = 'The requested path was not found.<br />' + message;
        else message = 'General execution error.<br />' + message;

        layout.error.message = message;
        layout.error.show();

    }
    else layout.error.hide();

});
