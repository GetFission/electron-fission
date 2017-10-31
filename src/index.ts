import axios from 'axios'
import * as fs from 'fs'
import * as util from './util'

function debug(...args: any[]) {
  if (process.env.DEBUG) {
    console.log(...args)
  }
}

function getAppVersion() {
  if (process.env.APP_VERSION) {
    return process.env.APP_VERSION
  }
  // TODO: Verify file exists
  // TODO: Don't hardcode in package.json path here
  const packageJson = fs.readFileSync('./app/package.json')
  const appVersion = JSON.parse(packageJson.toString()).appVersion
  return appVersion
}

function getBuildURL(): any {
  // changing to any for now - need to research how to tell typescript not to worry about returning BUILD_URL if null because it will never reach that due to conditional
  if (process.env.BUILD_URL) {
    console.log('build url:', process.env.BUILD_URL)
    return process.env.BUILD_URL
  }

  if (util.isTravis()) {
    const repoSlug = process.env.TRAVIS_REPO_SLUG
    const jobNumber = process.env.TRAVIS_JOB_ID
    return `https://travis-ci.org/${repoSlug}/jobs/${jobNumber}`
  }

  if (util.isAppVeyor()) {
    const repoSlug = process.env.APPVEYOR_REPO_NAME
    const buildNumber = process.env.APPVEYOR_BUILD_NUMBER
    return `https://ci.appveyor.com/project/${repoSlug}/build/build${buildNumber}`
  }
  return 'N/A'
}

function getBuildParams(): Map<string, string> {
  // https://docs.travis-ci.com/user/environment-variables/
  // https://www.appveyor.com/docs/environment-variables/
  const params = new Map();
  params.set('api_key', process.env.API_KEY)
  params.set('app_version', getAppVersion())
  params.set('api_key', process.env.API_KEY)
  params.set('api_key', process.env.API_KEY)
  params.set('build_url', getBuildURL())
  params.set('branch_name', process.env.TRAVIS_BRANCH || process.env.APPVEYOR_REPO_BRANCH || 'N/A')
  params.set('ci', util.getCiName())
  params.set('ci_job_id', process.env.TRAVIS_JOB_ID || process.env.APPVEYOR_JOB_ID || 'N/A')
  params.set('commit_hash', process.env.TRAVIS_COMMIT || process.env.APPVEYOR_REPO_COMMIT || 'N/A')
  params.set('platform', util.getAppPlatform())
  params.set('pull_request_number', process.env.TRAVIS_PULL_REQUEST || process.env.APPVEYOR_PULL_REQUEST_NUMBER)
  return params
}

export async function fissionPing() {
  try {
    const PING_URL = (process.env.PING_URL || 'https://getfission.com/review-apps/ping')
    const buildParams = getBuildParams()
    const buildParamsLog = new Map(buildParams.entries())
    buildParamsLog.delete('api_key')
    debug('[PING]', 'Sending ping with build params', buildParamsLog)

    const paramsObject : {[key : string]: string} = {}
    buildParams.forEach((value, key) => {paramsObject[key] = value})
    const resp = await axios.post(PING_URL, paramsObject)
    return true
  } catch (err) {
    throw new Error(JSON.stringify(err.response.data, null, ' '))
  }
}
