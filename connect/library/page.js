function Page() {

    this.show = function () {

        let action = new module.Action('/hello');

        action.onResponse = function (response) {
            console.log('on response', response);
        };

        action.onError = function (error) {
            console.error('on error', error);
        };

        action.execute()
            .then(response => console.log('promise response', response))
            .catch(error => console.error('promise error', error));

    };

}
