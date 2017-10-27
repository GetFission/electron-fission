import { execSync } from 'child_process'
import * as os from 'os'

export function validatePackageJson (packageJson : any) {
  const s3PublishInfo = packageJson.build.publish; 
  console.log('Detected publish info', JSON.stringify(s3PublishInfo, null, ' '))

  let validationErrors: string[] = []
  if (s3PublishInfo.provider !== "s3") {
    throw new Error('package.json:publish.provider key must have value "s3"')
  } else if (!s3PublishInfo.bucket) {
    throw new Error('package.json:publish.bucket key must have a bucket name')
  } else if (s3PublishInfo.path !== '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}') {
    throw new Error('package.json:publish.path key must be set to "${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}"')
  }
}

export function getAppPlatform(): string {
  if (process.env.APP_PLATFORM) {
    return process.env.APP_PLATFORM || 'N/A'
  }
  return process.env.PLATFORM || process.env.TRAVIS_OS_NAME || os.platform()
}

export function isTravis(): boolean {
  return process.env.TRAVIS ? true : false
}

export function isAppVeyor() {
  return process.env.APPVEYOR ? true : false
}

export function getCiName(): string {
  const travis = isTravis() ? 'travis' : ''
  const appveyor = isAppVeyor() ? 'appveyor' : ''
  return travis || appveyor || 'local'
}

export function getCommit () : string {
  if (isAppVeyor()) {
    return process.env.APPVEYOR_REPO_COMMIT
  }
  if (isTravis()) {
    return process.env.TRAVIS_COMMIT 
  }
  return execSync('git rev-parse HEAD')
    .toString()
    .trim()
}

export function getBranch () : string {
  if (isAppVeyor()) {
    return process.env.APPVEYOR_REPO_BRANCH
  }
  if (isTravis()) {
    return process.env.TRAVIS_COMMIT 
  }
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim()
}

export function getPlatform () : string {
  // TODO: differentiate between app platform vs ci platform?
  return getAppPlatform()
}