module.exports = function () {

    this.hello = () => {
        console.log('executing hello');
        return new Promise(resolve => setTimeout(resolve, 20000));
    };

};
