function Badge(phonegap) {

    // Define different sources of unread notifications
    // Ex: inbox, newsfeed
    var values = {};
    Object.defineProperty(this, 'value', {
        'get': function () {
            var value = 0;

            for (var i in values) {
                value += values[i];
            }

            return value;
        }
    });

    var badge;

    var ready = Delegate(this, function () {

        if (typeof cordova === 'object' &&
            cordova.plugins &&
            cordova.plugins.notification) {

            badge = cordova.plugins.notification.badge;
            badge.set(this.value);
        }

    });

    phonegap.done(ready);

    this.set = function (source, value) {

        try {
            value = parseInt(value);
        }
        catch (exc) {
            console.error(exc);
            return;
        }

        values[source] = value;

        if (badge) {
            badge.set(this.value);
        }

        console.log('badge set to:', this.value);

    };

}

beyond.badge = new Badge(beyond.phonegap);
