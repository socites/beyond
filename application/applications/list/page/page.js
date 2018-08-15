function Page() {

    function initialise() {
        console.log('page initialised');
    }

    this.template.render({'control': 'beyond-applications', 'texts': {'title': 'Hello world'}})
        .then(initialise);

}
