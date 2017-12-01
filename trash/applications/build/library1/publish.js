let cprocess = require('child_process');
let cwd = process.cwd();

let cmd = 'npm publish';
cprocess.execSync(
    cmd, {
        'cwd': cwd,
        'stdio': [0, 1, 2]
    });
