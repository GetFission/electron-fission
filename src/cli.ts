#!/usr/bin/env node

import * as yargs from 'yargs'

import * as path from 'path'
import * as fission from './ping'
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
  fission.ping()
    .then(() => console.log('[Ping] successful'))
    .catch(err => {
      console.log('[Ping] Failed to "ping".', err.toString())
      process.exit(1)
    })
}

if (argv._[0] === 'init') {
  const packageJsonPath = argv.path || path.join(process.cwd(), 'package.json')
  try {
    init.init(packageJsonPath, argv.bucket)
  } catch (err) {
    console.log('Failed to "init".', err.toString())
    process.exit(1)
  }
}

if (argv._[0] === 'prep') {
  const electronBuilderEnvFilePath = argv.path || path.join(process.cwd(), 'electron-builder.env')
  try{
    prep.prep(electronBuilderEnvFilePath)
  } catch (err) {
    console.log('Failed to "prep".', err.toString())
    process.exit(1)
  }
}