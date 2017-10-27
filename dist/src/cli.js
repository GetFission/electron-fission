#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var path = require("path");
var fission = require("./index");
var prep = require("./prep");
var init = require("./init");
var argv = yargs
    .usage('Usage: fission <command> [options]')
    .command('ping', 'Notifies fission server of build')
    .command('init', 'Initializes package.json for electron-fission')
    .demand('bucket')
    .example('fission --bucket my-s3-bucket', 'Initialize package.json with a bucket')
    .example('fission init --path custom/path/to/package.json', 'Specify path to package.json')
    .command('prep', 'Prepare dir for electron-builder publish. Run before starting electron-builder')
    .example('fission prep', 'Configures electron-builder to upload to S3 bucket')
    .help('h')
    .alias('h', 'help')
    .argv;
console.log(argv);
if (argv._[0] === 'ping') {
    fission.fissionPing()
        .then(function () { return console.log('[Ping] successful'); })
        .catch(function (err) { return console.log('[Ping] Error sending ping:', err); });
}
if (argv._[0] === 'init') {
    var packageJsonPath = argv.path || path.join(process.cwd(), 'pakcage.json');
    init.init(packageJsonPath, argv.bucket);
}
if (argv._[0] === 'prep') {
    prep.prep();
}
