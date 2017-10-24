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

function isTravis() : Boolean {
  return process.env.TRAVIS ? true : false
}

function isAppVeyor() {
  return process.env.APPVEYOR ? true : false
}

function getCiName () : String {
  const travis =  isTravis() ? 'travis' : ''
  const appveyor = isAppVeyor() ? 'appveyor': ''
  return travis || appveyor || 'local'
}

function getBuildURL () : String {
  if (process.env.BUILD_URL) return process.env.BUILD_URL

  if (isTravis()) {
    const repoSlug = process.env.TRAVIS_REPO_SLUG
    const jobNumber = process.env.TRAVIS_JOB_ID
    return `https://travis-ci.org/${repoSlug}/jobs/${jobNumber}`
  }

  if (isAppVeyor()) {
    const repoSlug = process.env.APPVEYOR_REPO_NAME
    const buildNumber = process.env.APPVEYOR_BUILD_NUMBER
    return `https://ci.appveyor.com/project/${repoSlug}/build/build${buildNumber}`
  }
  return 'N/A'
}

function getBuildParams () {
  // https://docs.travis-ci.com/user/environment-variables/
  // https://www.appveyor.com/docs/environment-variables/
  return {
    app_version: getAppVersion(),
    build_url: getBuildURL(),
    branch_name: process.env.TRAVIS_BRANCH || process.env.APPVEYOR_REPO_BRANCH || 'N/A',
    ci: getCiName(),
    ci_job_id: process.env.TRAVIS_JOB_ID || process.env.APPVEYOR_JOB_ID || 'N/A',
    commit_hash: process.env.TRAVIS_COMMIT || process.env.APPVEYOR_REPO_COMMIT || 'N/A',
    platform: getAppPlatform(),
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
