#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fission = require("./index");
fission.fissionPing().then(function () { return console.log('[PING] Finished ping'); });
