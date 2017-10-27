"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var detectIndent = require("detect-indent");
function writePublishSection(packageJsonPath, publishInfo) {
    var file = fs.readFileSync(packageJsonPath).toString();
    var indent = detectIndent(file).indent;
    var packageJson = JSON.parse(file);
    packageJson.build.publish = publishInfo;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, indent));
}
exports.writePublishSection = writePublishSection;
function init(packageJsonPath, s3Bucket) {
    var publishInfo = {
        provider: "s3",
        bucket: s3Bucket,
        path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
    };
    writePublishSection(packageJsonPath, publishInfo);
}
exports.init = init;
