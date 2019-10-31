module.exports = function () {

    this.hello = () => new Promise(resolve => setTimeout(() => resolve('hello world'), 10000));

};
