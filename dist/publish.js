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
/**
 * 1. check package.json has s3 publish info
 * 2. check publish.s3.path has proper macro info
 * 3. check AWS keys are in env
 * 3.5 set BRANCH/COMMIT/PLATFORM based on CI (appveyor/travis/local dev (ignore if local?))
 * 4. call electron buider with "-p always"
 * 5. ping fission
 */
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
