exports = module.react.createControl({
    'render': function (state, actions) {
        "use strict";

        let applications = state.applications;
        let output = [];

        for (let index in applications) {

            let application = applications[index];
            output.push(
                <div className="application" key={application.id}>
                    <div className="name">{application.name}</div>
                    <div className="dirname">{application.dirname}</div>

                    <paper-button
                        raised
                        data-url={'/applications/compile?application=' + application.name}
                        onClick={actions.navigate}>compilar
                    </paper-button>
                </div>
            );

        }

        return <div>{output}</div>;

    }
});
