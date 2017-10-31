#!/usr/bin/env node

import * as yargs from 'yargs'

import * as path from 'path'
import * as fission from './index'
import * as prep from './prep'
import * as init from './init'


const argv = yargs
  .usage('Usage: fission <command> [options]')
  .command('ping', 'Notifies fission server of build')
  .command('init', 'Initializes package.json for electron-fission', yarg => 
    yarg.demand('bucket')
  ) 
  .example('fission --bucket my-s3-bucket', 'Initialize package.json with a bucket')
  .example('fission init --path custom/path/to/package.json', 'Specify path to package.json')
  .command('prep', 'Prepare dir for electron-builder publish. Run before starting electron-builder')
  .example('fission prep', 'Configures electron-builder to upload to S3 bucket')
  .help('h')
  .alias('h', 'help')
  .argv

if (argv._[0] === 'ping') {
  fission.fissionPing()
    .then(() => console.log('[Ping] successful'))
    .catch(err => console.log('[Ping] Error sending ping', err.toString()))
}

if (argv._[0] === 'init') {
  const packageJsonPath = argv.path || path.join(process.cwd(), 'package.json')
  init.init(packageJsonPath, argv.bucket)
}

if (argv._[0] === 'prep') {
  const electronBuilderEnvFilePath = argv.path || path.join(process.cwd(), 'electron-builder.env')
  prep.prep(electronBuilderEnvFilePath)
}