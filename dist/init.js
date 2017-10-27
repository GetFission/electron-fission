"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function writePublishSection(publishInfo, packageJsonPath) {
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
    packageJson.build.publish = publishInfo;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, ' '));
}
exports.writePublishSection = writePublishSection;
function init(packageJsonPath, s3Bucket) {
    var publishInfo = {
        provider: "s3",
        bucket: s3Bucket,
        path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
    };
    writePublishSection(publishInfo, process.env);
}
exports.init = init;
