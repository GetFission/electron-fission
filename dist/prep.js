"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
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
    var fileLines = [];
    envVars.forEach(function (val, key) {
        fileLines.push(key + "=" + val + os.EOL);
    });
    fs.appendFileSync(path, fileLines.join(''));
}
exports.writeElectronBuilderEnvFile = writeElectronBuilderEnvFile;
function prep(envFilePath) {
    writeElectronBuilderEnvFile(envFilePath, getEnvVars());
}
exports.prep = prep;
