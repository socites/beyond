function Analytics(phonegap) {
    "use strict";

    var configured;
    var ready;
    var accountID = beyond.params.analytics;
    var analytics;

    function success() {
        ready = true;
    }

    function error() {
        // nothing to do right now
    }

    function onPhonegapReady() {

        if (beyond.params.local) {
            return;
        }

        analytics = window.ga;
        if (!analytics) return;

        configured = true;
        analytics.startTrackerWithId(accountID, 10, success, error);
        analytics.setAppVersion(beyond.params.version);

    }

    if (beyond.phonegap.isPhonegap && accountID) {
        phonegap.done(onPhonegapReady);
    }

    this.trackEvent = function (category, action, label, value) {

        if (!configured) return;
        if (!ready) return;

        function success() {
            // nothing to do right now
        }

        function error() {
            // nothing to do right now
        }

        analytics.trackEvent(category, action, label, value, success, error);

    };

    this.trackView = function (url) {

        if (!configured) return;
        if (!ready) return;

        function success() {
            // nothing to do right now
        }

        function error() {
            // nothing to do right now
        }

        analytics.trackView(url, success, error);

    };

    this.exit = function (callback) {

        if (!ready) {
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

        if (analytics) analytics.dispatch(success, error);

        ready = false;

    };

}

beyond.analytics = new Analytics(beyond.phonegap);
