"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
