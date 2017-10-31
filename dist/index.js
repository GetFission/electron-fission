"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
var util = require("./util");
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.DEBUG) {
        console.log.apply(console, args);
    }
}
function getAppVersion() {
    if (process.env.APP_VERSION) {
        return process.env.APP_VERSION;
    }
    // TODO: Verify file exists
    // TODO: Don't hardcode in package.json path here
    var packageJson = fs.readFileSync('./app/package.json');
    var appVersion = JSON.parse(packageJson.toString()).appVersion;
    return appVersion;
}
function getBuildURL() {
    // changing to any for now - need to research how to tell typescript not to worry about returning BUILD_URL if null because it will never reach that due to conditional
    if (process.env.BUILD_URL) {
        console.log('build url:', process.env.BUILD_URL);
        return process.env.BUILD_URL;
    }
    if (util.isTravis()) {
        var repoSlug = process.env.TRAVIS_REPO_SLUG;
        var jobNumber = process.env.TRAVIS_JOB_ID;
        return "https://travis-ci.org/" + repoSlug + "/jobs/" + jobNumber;
    }
    if (util.isAppVeyor()) {
        var repoSlug = process.env.APPVEYOR_REPO_NAME;
        var buildNumber = process.env.APPVEYOR_BUILD_NUMBER;
        return "https://ci.appveyor.com/project/" + repoSlug + "/build/build" + buildNumber;
    }
    return 'N/A';
}
function getBuildParams() {
    // https://docs.travis-ci.com/user/environment-variables/
    // https://www.appveyor.com/docs/environment-variables/
    return {
        app_version: getAppVersion(),
        build_url: getBuildURL(),
        branch_name: process.env.TRAVIS_BRANCH || process.env.APPVEYOR_REPO_BRANCH || 'N/A',
        ci: util.getCiName(),
        ci_job_id: process.env.TRAVIS_JOB_ID || process.env.APPVEYOR_JOB_ID || 'N/A',
        commit_hash: process.env.TRAVIS_COMMIT || process.env.APPVEYOR_REPO_COMMIT || 'N/A',
        platform: util.getAppPlatform(),
        pull_request_number: process.env.TRAVIS_PULL_REQUEST || process.env.APPVEYOR_PULL_REQUEST_NUMBER
    };
}
function fissionPing() {
    return __awaiter(this, void 0, void 0, function () {
        var PING_URL, buildParams, resp, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    PING_URL = (process.env.PING_URL || 'https://getfission.com/review-apps/ping');
                    buildParams = getBuildParams();
                    debug('[PING]', 'Sending ping with build params', buildParams);
                    return [4 /*yield*/, axios_1.default.post(PING_URL, buildParams)];
                case 1:
                    resp = _a.sent();
                    console.log('[PING]', 'Response', resp.data);
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    console.log('[Error] Could not ping electron-fission server');
                    console.log('[Error]', err_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.fissionPing = fissionPing;
