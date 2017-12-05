exports = module.react.createControl({
    'render': function (state, actions) {
        "use strict";

        let applications = state.applications;
        let output = [];

        for (let index in applications) {

            let application = applications[index];
            output.push(
                <div className="application" key="application">
                    <div className="name">{application.name}</div>
                    <div className="dirname">{application.dirname}</div>
                    <paper-button>abrir</paper-button>
                </div>
            );
            console.log(application);

        }

        return <div>{output}</div>;

    }
});
