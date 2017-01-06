exports = module.react.createControl({
    'navigateStatic': function () {
        "use strict";
        beyond.navigate('/static');
    },
    'render': function (state, actions, control) {
        "use strict";

        var Professional = react.professional;

        return (<div className="professionals-list">
            {
                state.professionals.map(function (professional) {
                    return (
                        <Professional
                            key={professional.id}
                            state={professional}
                            actions={actions}></Professional>
                    )
                })
            }
            <div className="progress">{state.progress}</div>
            <paper-button onClick={actions.increment}>Increment</paper-button>
            <paper-button onClick={this.navigateStatic}>Navigate Static</paper-button>
        </div>)
    }
});
