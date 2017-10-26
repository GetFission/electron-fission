#!/usr/bin/env node

import * as fission from './index'
import * as init from './init'

if (process.argv[2] === 'ping') {
    fission.fissionPing()
      .then(() => console.log('[Ping] successful'))
      .catch(err => console.log('[Ping] Error sending ping:', err))
}

if (process.argv[2] === 'init') {
  init.init()
}
