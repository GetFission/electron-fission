import axios from 'axios'
import * as fs from 'fs'

const PING_URL = process.env.PING_URL

function debug (...args: any[]) {
  if (process.env.DEBUG) {
    console.log(...args)
  }
}

function getAppVersion () {
  if (process.env.APP_VERSION) {
    return process.env.APP_VERSION
  }
  // TODO: Verify file exists
  const packageJson = fs.readFileSync('./app/package.json')
  const appVersion = JSON.parse(packageJson.toString()).appVersion
  return appVersion
}

function getAppPlatform () : String {
  if (process.env.APP_PLATFORM) {
    return process.env.APP_PLATFORM
  }
  return process.env.PLATFORM || process.env.TRAVIS_OS_NAME || 'N/A'
}

function getCiName () : String {
  const travis = process.env.TRAVIS ? 'travis' : null
  const appVeyor = process.env.APPVEYOR ? 'appveyor' : null
  return travis || appVeyor || 'local'
}

function getBuildParams () {
  // https://docs.travis-ci.com/user/environment-variables/
  // https://www.appveyor.com/docs/environment-variables/
  return {
    ci: getCiName(),
    commit_hash: process.env.TRAVIS_COMMIT || process.env.APPVEYOR_REPO_COMMIT || 'N/A',
    platform: getAppPlatform(),
    branch_name: process.env.TRAVIS_BRANCH || process.env.APPVEYOR_REPO_BRANCH || 'N/A',
    ci_job_id: process.env.TRAVIS_JOB_ID || process.env.APPVEYOR_JOB_ID || 'N/A',
    app_version: getAppVersion(),
    pull_request_number: process.env.TRAVIS_PULL_REQUEST || process.env.APPVEYOR_PULL_REQUEST_NUMBER
  }
}

export async function fissionPing() {
  try {
    const buildParams = getBuildParams()
    debug('[PING]', 'Sending ping with build params', buildParams)
    const resp = await axios.post(PING_URL, buildParams)
    console.log('[PING]', 'Response', await resp.data)
    return true
  } catch (err) {
    console.log('[Error] Could not ping electron-fission server')
    console.log('[Error]', err)
    return false
  }
}
