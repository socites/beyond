exports = module.react.createControl({
    'render': function (state, actions) {
        "use strict";

        if (!state.ready) {
            return null;
        }

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

        output.push(<react.messages key="messages" state={state.messages}/>);

        return <div className="library">{output}</div>;

    }
});
