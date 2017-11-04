import { spawn } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'

import * as detectIndent from 'detect-indent'

import * as util from './util'

export function getEnvVars () : Map <string, string> {
  let map = new Map()
  map.set('COMMIT', util.getCommit())
  map.set('BRANCH', util.getBranch())
  map.set('PLATFORM', util.getPlatform())
  return map
}

export function writeElectronBuilderEnvFile (path : string, envVars : Map <string, string>) {
  const fileLines: string[] = []
  envVars.forEach((val, key) => {
    fileLines.push(`${key}=${val}${os.EOL}`)
  })
  fs.appendFileSync(path, fileLines.join(''))
}

export function prep (envFilePath : string) {
  writeElectronBuilderEnvFile(envFilePath, getEnvVars())
}