// Hide the splash screen
let timer;

function hide() {

    clearTimeout(timer);
    beyond.unbind('popstate', hide);

    beyond.phonegap.done(function () {
        if (navigator.splashscreen) navigator.splashscreen.hide();
    });

}

beyond.bind('page-shown', hide);
setTimeout(hide, 5000);
