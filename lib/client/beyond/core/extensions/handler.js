function ExtensionsHandler(extensions) {

    this.get = function (target, name) {

        if (extensions.has(name)) {

            let extension = extensions.get(name);
            let props = extension.props;
            extension = extension.extension;

            return (props.type === 'function') ? extension : extension();

        }

        if (name in target) {
            return target[name];
        }

    };

}
