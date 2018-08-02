function CodeDependencies() {

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    this.require = () => promise;

    this.set = function (dependencies) {

        let modules = [];
        for (let module in dependencies) {
            if (!dependencies.hasOwnProperty(module)) continue;
            modules.push(module);
        }

        require(modules, function () {

            let modules = {}, i = 0;
            for (let dependency in dependencies) {

                let name = dependencies[dependency];
                modules[name] = arguments[i];
                i++;

            }

            resolve(modules);

        }, reject);

    };

}
