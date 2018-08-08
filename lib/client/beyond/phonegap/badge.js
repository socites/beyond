function Badge(phonegap) {

    let events = new Events({'bind': this});

    // Define different sources of unread notifications
    // Ex: inbox, newsfeed
    let values = {};
    Object.defineProperty(this, 'values', {
        'get': function () {
            return values;
        }
    });

    Object.defineProperty(this, 'value', {
        'get': function () {
            let value = 0;

            for (let i in values) {
                value += values[i];
            }

            return value;
        }
    });

    let badge;

    let ready = Delegate(this, function () {

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

        events.trigger('change', source, value);
        events.trigger('change:' + source, source, value);

    };

}

let phonegap = beyond.phonegap;
phonegap.badge = new Badge(beyond.phonegap);
