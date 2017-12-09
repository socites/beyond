exports = React.createClass({
    'render': function () {
        "use strict";

        var state = this.props.state;

        var output = [];

        for (let index in state) {

            let message = state[index];
            let cls = 'message';
            cls += (message.type === 'error') ? ' error' : '';

            output.push(
                <div className={cls} key={message.id}>
                    {message.message}
                </div>
            );

        }

        return <div className="messages">{output}</div>;

    }
});
