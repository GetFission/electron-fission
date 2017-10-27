#!/usr/bin/env node

import * as fission from './index'

fission.fissionPing().then(() => console.log('[PING] Finished ping'))
