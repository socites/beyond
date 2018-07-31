function ExtensionsHandler(extensions) {

    this.get = function (target, name) {

        if (extensions.has(name)) {
            return extensions.get(name);
        }

        if (name in target) {
            return target[name];
        }

    };

}
