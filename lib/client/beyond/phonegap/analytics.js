function Analytics(phonegap) {
    "use strict";

    var configured;
    var accountID = beyond.params.analytics;
    var google, googleReady, facebook;

    function success() {
        googleReady = true;
    }

    function error() {
        // nothing to do right now
    }

    function onPhonegapReady() {

        if (beyond.params.local) {
            return;
        }

        google = window.ga;
        if (google) {
            google.startTrackerWithId(accountID, 10, success, error);
            google.setAppVersion(beyond.params.version);
        }

        facebook = window.facebookConnectPlugin;

        configured = true;

    }

    if (beyond.phonegap.isPhonegap && accountID) {
        phonegap.done(onPhonegapReady);
    }

    this.trackEvent = function (category, action, label, value) {

        if (!configured) return;

        function success() {
            // nothing to do right now
        }

        function error() {
            // nothing to do right now
        }

        if (googleReady) {
            google.trackEvent(category, action, label, value, success, error);
        }
        if (facebook) {
            facebook.logEvent(action, {'category': category, 'label': label, 'value': value}, 1, success, error);
        }

    };

    this.trackView = function (url) {

        if (!configured) return;

        function success() {
            // nothing to do right now
        }

        function error() {
            // nothing to do right now
        }

        if (googleReady) {
            google.trackView(url, success, error);
        }
        if (facebook) {
            facebook.logEvent(url, null, 1, success, error);
        }

    };

    this.exit = function (callback) {

        if (!googleReady) {
            if (callback) callback();
            return;
        }

        function success() {
            if (callback) callback();
        }

        function error() {
            // TODO: add an error handler
            if (callback) callback();
        }

        if (google) google.dispatch(success, error);

        googleReady = false;

    };

}

beyond.analytics = new Analytics(beyond.phonegap);
