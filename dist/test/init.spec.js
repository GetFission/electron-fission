"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
require("mocha");
var chai_1 = require("chai");
var init_1 = require("../src/init");
describe('fission init', function () {
    // beforeEach(() => {
    // })
    it('initalizes empty package.json', function () {
        var emptyPackageJson = path.join(__dirname, 'data', 'empty-package.json');
        var publishInfo = {
            provider: "s3",
            bucket: "sample-bucket",
            path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
        };
        var res = fs.readFileSync(emptyPackageJson);
        init_1.writePublishSection(emptyPackageJson, publishInfo);
        chai_1.expect(result).to.equal(true);
    });
    it('initalizes existing package.json', function () {
        chai_1.expect(result).to.equal(true);
    });
});
