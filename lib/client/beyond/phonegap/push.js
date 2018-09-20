function Push(phonegap) {
    'use strict';

    var events = new Events({'bind': this});

    var push;

    var registrationId;
    Object.defineProperty(this, 'registrationId', {
        'get': function () {
            return registrationId;
        }
    });

    var device = 'android';
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) device = 'ios';

    Object.defineProperty(this, 'device', {
        'get': function () {
            return device;
        }
    });

    function onRegistration(data) {
        if (!data) {
            return;
        }
        registrationId = data.registrationId;
        events.trigger('registration', registrationId);
    }

    function onNotification(data) {

        console.log(data);

        // User tapped on notification
        // In case of iOS the notification callback is only called if you tapped
        // on the notification while not in foreground mode, and content av. is not enabled
        let additional = data.additionalData;
        if (additional && additional.url && !additional.foreground &&
            (additional.dismissed !== undefined || additional.coldstart || iOS)) {

            let url = additional.url.startsWith('/') ? url : `/${url}`;
            beyond.navigate(url);

        }

        events.trigger('notification', data);
        push.finish();

    }

    function onError(error) {
        beyond.logs.append('Push notification error: ' + error);
    }

    function onPhonegapDone() {

        if (typeof PushNotification !== 'object') {
            return;
        }

        var config = {
            'android': {
                'senderID': beyond.params.pushNotifications.senderID
            },
            'ios': {
                'alert': 'true',
                'badge': 'true',
                'sound': 'true'
                /*
                 "senderID": "...",
                 "gcmSandbox": "true"
                 */
            },
            'windows': {}
        };

        push = PushNotification.init(config);

        push.on('registration', onRegistration);
        push.on('notification', onNotification);
        push.on('error', onError);

    }

    if (phonegap.isPhonegap && beyond.params.pushNotifications) {
        phonegap.done(onPhonegapDone);
    }

}

var phonegap = beyond.phonegap;
phonegap.push = new Push(phonegap);
