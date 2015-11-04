module.exports = function (application, module) {
    "use strict";

    let order = application.plugins[module.ID];
    if (!order) return '';

    let script = '';
    script += '(function (module) {\n\n';

    script += '    module = module[0];\n';
    script += '    module.plugins.order = ' + JSON.stringify(order) + ';\n\n';

    script += '})(beyond.modules.get("' + module.ID + '"));\n\n';

    return script;

};
