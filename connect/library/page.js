function Page() {

    this.show = async function () {

        const action = new module.Action('/hello');

        const response = await action.execute();
        console.log(response);

    };

}
