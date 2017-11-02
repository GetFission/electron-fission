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
    .command('init', 'Initializes package.json for electron-fission', function (yarg) {
    return yarg.demand('bucket');
})
    .example('fission --bucket my-s3-bucket', 'Initialize package.json with a bucket')
    .example('fission init --path custom/path/to/package.json', 'Specify path to package.json')
    .command('prep', 'Prepare dir for electron-builder publish. Run before starting electron-builder')
    .example('fission prep', 'Configures electron-builder to upload to S3 bucket')
    .help('h')
    .alias('h', 'help')
    .argv;
if (argv._[0] === 'ping') {
    fission.fissionPing()
        .then(function () { return console.log('[Ping] successful'); })
        .catch(function (err) {
        console.log('[Ping] Failed to "ping".', err.toString());
        process.exit(1);
    });
}
if (argv._[0] === 'init') {
    var packageJsonPath = argv.path || path.join(process.cwd(), 'package.json');
    try {
        init.init(packageJsonPath, argv.bucket);
    }
    catch (err) {
        console.log('Failed to "init".', err.toString());
        process.exit(1);
    }
}
if (argv._[0] === 'prep') {
    var electronBuilderEnvFilePath = argv.path || path.join(process.cwd(), 'electron-builder.env');
    try {
        prep.prep(electronBuilderEnvFilePath);
    }
    catch (err) {
        console.log('Failed to "prep".', err.toString());
        process.exit(1);
    }
}
