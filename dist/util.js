"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var os = require("os");
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
exports.validatePackageJson = validatePackageJson;
function getAppPlatform() {
    if (process.env.APP_PLATFORM) {
        return process.env.APP_PLATFORM || 'N/A';
    }
    return process.env.PLATFORM || process.env.TRAVIS_OS_NAME || os.platform();
}
exports.getAppPlatform = getAppPlatform;
function isTravis() {
    return process.env.TRAVIS ? true : false;
}
exports.isTravis = isTravis;
function isAppVeyor() {
    return process.env.APPVEYOR ? true : false;
}
exports.isAppVeyor = isAppVeyor;
function getCiName() {
    var travis = isTravis() ? 'travis' : '';
    var appveyor = isAppVeyor() ? 'appveyor' : '';
    return travis || appveyor || 'local';
}
exports.getCiName = getCiName;
function getCommit() {
    if (isAppVeyor()) {
        return process.env.APPVEYOR_REPO_COMMIT;
    }
    if (isTravis()) {
        return process.env.TRAVIS_COMMIT;
    }
    return child_process_1.execSync('git rev-parse HEAD')
        .toString()
        .trim();
}
exports.getCommit = getCommit;
function getBranch() {
    if (isAppVeyor()) {
        return process.env.APPVEYOR_REPO_BRANCH;
    }
    if (isTravis()) {
        return process.env.TRAVIS_COMMIT;
    }
    return child_process_1.execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();
}
exports.getBranch = getBranch;
function getPlatform() {
    // TODO: differentiate between app platform vs ci platform?
    return getAppPlatform();
}
exports.getPlatform = getPlatform;
