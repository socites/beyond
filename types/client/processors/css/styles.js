let ModuleStyles = function (module) {

    this.push = function (styles, is) {

        // process css value
        let values = new Values(module);
        let resources = new Resources(module);
        styles = resources.process(styles);
        styles = values.process(styles);

        // append styles into the DOM
        let code = `<style module="${module.id}"${is ? ' is="' + is + '"' : ''}>${styles}</style>`;
        $('head').append(code);

    };

};
