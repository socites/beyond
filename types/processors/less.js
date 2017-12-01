module.exports = require('async')(function *(resolve, reject, module, type, config, finder, minify, error) {

    // Always minify css styles
    minify = true;

    let files;
    let template = (module.application) ? module.application.template : undefined;
    files = (template) ? yield template.getLessModules(module, error) : [];
    files = files.concat(yield (finder(module, type, 'less', config)));

    let fs = require('co-fs');

    let output = '';
    for (let file of files) {

        if (file.extname !== '.less') {
            reject(error('invalid file extension "' + file.relative.file + '"'));
            return;
        }

        output += yield fs.readFile(file.file, {'encoding': 'utf8'});

    }

    if (!output) {
        resolve();
        return;
    }

    // Compile less
    let less = require('less');
    less.render(output, {'compress': false}, function (e, processed) {

        if (e) {
            reject(error(e.message));
            return;
        }

        output = processed.css;

    });

    if (!minify) {
        // replace all ' to "
        output = output.replace(/\'/g, '"');
        resolve(output);
        return;
    }

    // Minify css
    let cleaned = new (require('clean-css'))().minify(output);
    if (cleaned.errors.length || cleaned.warnings.length) {

        for (let i in cleaned.errors) {
            console.log('\tERROR: '.red + (cleaned.errors[i]).red);
        }
        for (let i in cleaned.warnings) {
            console.log('\tWARNING: '.yellow + (cleaned.warnings[i]).yellow);
        }

        if (cleaned.errors.length) {
            reject(error('check console for warning and errors'));
            return;
        }

    }
    output = cleaned.styles;

    // replace all ' to "
    output = output.replace(/\'/g, '"');

    let is = (typeof config.is === 'string') ? config.is : '';

    // just insert the styles in the DOM
    let script = '';
    script += '/**********\n';
    script += ' CSS STYLES\n';
    script += ' **********/\n\n';
    script += '(function() {\n';
    script += '\tvar styles = \'' + output + '\';\n';
    script += '\tvar is = \'' + is + '\';\n';
    script += '\tmodule.styles.push(styles, is);\n';
    script += '})();\n\n';

    resolve(script);

});
