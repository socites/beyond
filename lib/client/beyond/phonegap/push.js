function Push(phonegap) {

    var events = new Events({'bind': this});

    var push;

    var registrationData;
    Object.defineProperty(this, 'registrationId', {
        'get': function () {
            return registrationData.registrationId;
        }
    });

    function update() {

        // Just for testing purposes
        var params = {};

        if (typeof PushNotification !== 'object') return;

        if (!registrationData) return;
        params.registrationId = registrationData.registrationId;

        if (auth.session.valid) {

            params.token = auth.session.token;

            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (iOS) params.device = 'ios';

            module.execute('register', params, function (response, error) {
                // Now we are doing nothing right now
            });

        }
        else {

            /*
             module.execute('unregister', params, function (response, error) {
             // Now we are doing nothing
             console.log(response, error);
             });
             */

        }

    }

    function onRegistration(data) {
        registrationData = data;
        update();
    }

    function onNotification(data) {

        beyond.logs.append(JSON.stringify(data));

        var type = data.additionalData.type;
        var coldstart = data.additionalData.coldstart;
        var foreground = data.additionalData.foreground;

        if (type === 'new-message' && (coldstart || !foreground)) {
            beyond.logs.append('/conversation/' + data.additionalData.conversation_id);
            beyond.navigate('/conversation/' + data.additionalData.conversation_id);
        }

        events.trigger('notification', data);

        push.finish();

    }

    function onError(error) {
        beyond.logs.append('Push notification error: ' + error);
    }

    phonegap.done(function () {

        // in case that the push-notifications plugin is not installed
        if (typeof PushNotification !== 'object') return;

        var config = {
            "android": {
                "senderID": beyond.params.pushNotifications.senderID
            },
            "ios": {
                "alert": "true",
                "badge": "true",
                "sound": "true"
                /*
                 "senderID": "...",
                 "gcmSandbox": "true"
                 */
            },
            "windows": {}
        };

        push = PushNotification.init(config);

        push.on('registration', onRegistration);
        push.on('notification', onNotification);
        push.on('error', onError);

    });

    auth.bind('change', update);
    update();

}

var phonegap = beyond.phonegap;
phonegap.push = new Push(phonegap);
