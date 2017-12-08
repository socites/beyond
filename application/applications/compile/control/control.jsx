exports = module.react.createControl({
    'render': function (state, actions) {
        "use strict";

        var disabled = {};
        disabled.disabled = (state.compiling) ? true : undefined;

        var output = [];
        output.push(<div key="name" className="name">{state.name}</div>);
        output.push(<div key="dirname" className="dirname">{state.dirname}</div>);

        output.push(
            <paper-button
                key="button"
                onClick={actions.compile}
                {...disabled}
                raised>Compile
            </paper-button>
        );

        return <div className="application">{output}</div>;

    }
});
