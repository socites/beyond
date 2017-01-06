exports = React.createClass({
    'deleteProfessional': function () {
        "use strict";

        var actions = this.props.actions;
        var state = this.props.state;

        actions.deleteProfessional(state.id);

    },
    'render': function () {
        "use strict";

        var state = this.props.state;

        return (
            <div className="professional">
                <div className="name">{state.name}</div>
                <paper-button
                    className="delete"
                    onClick={this.deleteProfessional}>delete
                </paper-button>
            </div>
        );

    }
});
