exports = module.react.createControl({
    'render': function (state, actions) {
        "use strict";

        let libraries = state.libraries;
        let output = [];

        for (let index in libraries) {

            let library = libraries[index];
            output.push(
                <div className="library" key={library.id}>
                    <div className="name">{library.name}</div>
                    <div className="dirname">{library.dirname}</div>

                    <paper-button
                        raised
                        data-url={'/libraries/compile?library=' + library.name}
                        onClick={actions.navigate}>compilar
                    </paper-button>
                </div>
            );

        }

        return <div>{output}</div>;

    }
});
