// Universal Links (iOS) and depp links (Android) support
function Links(phonegap) {
    "use strict";

    function onLink(event) {
        beyond.navigate(event.path);
    }

    function onPhonegapReady() {

        if (beyond.params.local) {
            return;
        }

        var ul = window.universalLinks;

        if (!ul) {
            return;
        }

        ul.subscribe(null, onLink);

    }

    if (beyond.phonegap.isPhonegap) {
        phonegap.done(onPhonegapReady);
    }

}

new Links(beyond.phonegap);
