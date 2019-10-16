#!/usr/bin/env node

var args = process.argv;
if (args[2] === 'postinstall') {
    require('./postinstall.js')();
}
else {
    require('./server.js')();
}
