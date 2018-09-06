function Page() {

    this.show = function () {

        let action = new module.Action('/hello');

        action.onResponse = function (response) {
            console.log(response);
        };

        action.onError = function (error) {
            console.error(error);
        };

        action.execute();

    };

}
