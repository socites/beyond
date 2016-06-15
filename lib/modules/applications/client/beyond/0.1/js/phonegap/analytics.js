function Analytics(phonegap) {

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
        analytics = window.plugins.gaPlugin;
        if (!analytics) return;

        configured = true;
        analytics.init(success, error, accountID, 10);
    }

    if (accountID) {
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

        analytics.trackEvent(success, error, category, action, label, value);

    };

    this.trackPage = function (url) {

        if (!configured) return;
        if (!ready) return;

        function success() {
            // nothing to do right now
        }

        function error() {
            // nothing to do right now
        }

        analytics.trackPage(success, error, url);

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

        if (analytics) analytics.exit(success, error);

        ready = false;

    };

}

beyond.analytics = new Analytics(beyond.phonegap);
