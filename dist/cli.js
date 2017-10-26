#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fission = require("./index");
var init = require("./init");
if (process.argv[2] === 'ping') {
    fission.fissionPing()
        .then(function () { return console.log('[Ping] successful'); })
        .catch(function (err) { return console.log('[Ping] Error sending ping:', err); });
}
if (process.argv[2] === 'init') {
    init.init();
}
