"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var util = require("./util");
function getEnvVars() {
    var map = new Map();
    map.set('COMMIT', util.getCommit());
    map.set('BRANCH', util.getBranch());
    map.set('PLATFORM', util.getPlatform());
    return map;
}
exports.getEnvVars = getEnvVars;
function writeElectronBuilderEnvFile(path, envVars) {
    envVars.forEach(function (val, key) {
        // console.log('key', key, 'val', val)
        fs.appendFileSync(path, key + "=" + val + "\n");
    });
}
exports.writeElectronBuilderEnvFile = writeElectronBuilderEnvFile;
function prep(envFilePath) {
    writeElectronBuilderEnvFile(envFilePath, getEnvVars());
}
exports.prep = prep;
