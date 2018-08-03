module.exports = function (config) {

    let dependencies = config.dependencies;
    dependencies = (typeof dependencies === 'object') ? dependencies : {};

    let code = (typeof dependencies.code === 'object') ? dependencies.code : {};
    let controls = (dependencies.controls instanceof Array) ? dependencies.controls : [];
    Object.defineProperty(this, 'controls', {'get': () => controls});

    // The array of required dependencies
    let required = [];
    Object.defineProperty(this, 'required', {'get': () => required});

    // The name of the variables that stores the amd returned values
    let args = [];

    function add(dependency, property) {
        required.push(dependency);
        args.push(property);
    }

    for (let dependency in code) {
        if (!code.hasOwnProperty(dependency)) continue;
        add(dependency, code[dependency]);
    }

    if (config.less || config.css) add('bundles/processors/css/js', 'css');
    if (config.html) add('bundles/static/hogan.js/hogan-3.0.2.min.amd', 'hogan');
    if (config.html) add('bundles/processors/html/js', 'html');
    if (config.jsx) add('bundles/processors/jsx/js', 'jsx');
    if (config.txt) add('bundles/processors/txt/js', 'txt');

    // The script required by the module to assign the variables of the amd returned values
    let script = `    let dependencies = {};\n`;
    args.forEach((variable, index) => {
        script += `    ${variable} = arguments[${index}];\n`;
        script += `    dependencies['${variable}'] = ${variable};\n`;
    });
    Object.defineProperty(this, 'script', {'get': () => script});

};
