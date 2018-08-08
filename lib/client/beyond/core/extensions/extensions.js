function Extensions() {

    let extensions = new Map();
    Object.defineProperty(this, 'values', {'get': () => extensions.values()});
    Object.defineProperty(this, 'keys', {'get': () => extensions.keys()});
    Object.defineProperty(this, 'size', {'get': () => extensions.size});

    this.register = function () {

        if (arguments.length < 2) {
            throw new Error('Invalid parameters');
        }
        let args = [...arguments];

        let name = args.pop();
        let props = (arguments.length === 3) ? args.pop() : undefined;
        let extension = args.pop();

        props = (props) ? props : {};
        props.type = (props.type) ? props.type : 'function';

        extensions.set(name, {
            'props': props,
            'extension': extension
        });

    };

    this.has = (name) => extensions.has(name);
    this.get = (name) => extensions.get(name);

}
