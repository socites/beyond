function SNA() {
    "use strict";

    var events = new Events({'bind': this});

    var state = {
        'progress': 0,
        'professionals': [
            {
                'id': 0,
                'name': 'Gregory House',
                'title': 'Department of Diagnostic Medicine'
            },
            {
                'id': 1,
                'name': 'Meredith Grey',
                'title': 'Head of General Surgery'
            }
        ]
    };
    Object.defineProperty(this, 'state', {
        'get': function () {
            return state;
        }
    });

    var actions = {
        'increment': function () {
            state.progress++;
            events.trigger('change');
        },
        'deleteProfessional': function (id) {
            for (var i in state.professionals) {
                var professional = state.professionals[i];
                if (professional.id === id) {
                    state.professionals.splice(i, 1);
                    events.trigger('change');
                }
            }
        }
    };
    Object.defineProperty(this, 'actions', {
        'get': function () {
            return actions;
        }
    });

}
