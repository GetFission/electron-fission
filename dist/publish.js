"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var child_process_1 = require("child_process");
var fission = require("./index");
function validatePackageJson(packageJson) {
    var s3PublishInfo = packageJson.build.publish;
    console.log('Detected publish info', JSON.stringify(s3PublishInfo, null, ' '));
    var validationErrors = [];
    if (s3PublishInfo.provider !== "s3") {
        throw new Error('package.json:publish.provider key must have value "s3"');
    }
    else if (!s3PublishInfo.bucket) {
        throw new Error('package.json:publish.bucket key must have a bucket name');
    }
    else if (s3PublishInfo.path !== '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}') {
        throw new Error('package.json:publish.path key must be set to "${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}"');
    }
}
function getEnvVars() {
    return {};
}
function publish() {
    var packageJson = JSON.parse(fs.readFileSync('package.json').toString());
    validatePackageJson(packageJson);
    var env = {};
    env = __assign({}, process.env, getEnvVars());
    var build = child_process_1.spawn('./node_modules/.bin/build', ['-p', 'always'], { env: env });
    build.stdout.on('data', function (data) {
        console.log("[Builder stdout] " + data);
    });
    build.stderr.on('data', function (data) {
        console.log("[Builder stderr]: " + data);
    });
    build.on('close', function (code) {
        console.log("Builder child process exited with code " + code);
        if (code === 0) {
            fission.fissionPing()
                .then(function () { return console.log('[Ping] successful'); })
                .catch(function (err) { return console.log('[Ping] Error sending ping:', err); });
        }
    });
}
exports.publish = publish;
