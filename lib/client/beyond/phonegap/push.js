function Push(phonegap) {
    'use strict';

    let events = new Events({'bind': this});

    let push;

    let registrationId;
    Object.defineProperty(this, 'registrationId', {'get': () => registrationId});

    let device = 'android';
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) device = 'ios';

    Object.defineProperty(this, 'device', {'get': () => device});

    function onRegistration(data) {
        if (!data) {
            return;
        }
        registrationId = data.registrationId;
        events.trigger('registration', registrationId);
    }

    function onNotification(data) {

        // let type = data.additionalData.type;
        // let coldstart = data.additionalData.coldstart;
        // let foreground = data.additionalData.foreground;

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

        let config = {
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

let phonegap = beyond.phonegap;
phonegap.push = new Push(phonegap);
