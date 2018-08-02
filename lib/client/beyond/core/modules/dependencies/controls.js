function ControlsDependencies() {

    let resolve, reject;
    let promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });

    this.import = () => promise;

    this.set = async function (dependencies) {

        if (!dependencies instanceof Array || !dependencies.length) {
            return;
        }

        resolve(await(beyond.controls.import(dependencies)));

    };

}
