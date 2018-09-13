function Page() {

    this.show = function () {

        let action = new module.Action('/hello');

        action.onResponse = function (response) {
            console.log(response);
        };

        action.onError = function (error) {
            console.error(error);
        };

        setTimeout(function () {

            console.log('executing action');
            action.execute()
                .then(response => console.log(response))
                .catch(error => console.error(error));

        }, 5000);

    };

}
