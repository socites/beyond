exports = module.react.createControl({
    'render': function (state, actions, control) {
        "use strict";

        return (<div className="beyond-control">
            {state.title}
        </div>);
    }
});
