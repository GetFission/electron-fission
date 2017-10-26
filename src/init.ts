import * as fs from 'fs'
import { spawn } from 'child_process'

import * as fission from './index'

function validatePackageJson (packageJson : any) {
    const s3PublishInfo = packageJson.build.publish; 
    console.log('Detected publish info', JSON.stringify(s3PublishInfo, null, ' '))

    let validationErrors : string[] = []
    if (s3PublishInfo.provider !== "s3") {
        throw new Error('package.json:publish.provider key must have value "s3"')
    } else if (!s3PublishInfo.bucket) {
        throw new Error('package.json:publish.bucket key must have a bucket name')
    } else if (s3PublishInfo.path !== '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}') {
        throw new Error('package.json:publish.path key must be set to "${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}"')
    }
}

function getEnvVars () : Object{
   return {}
}

export function init () : void {
  /**
   * prepares package.json
   */
  const packageJson = JSON.parse(fs.readFileSync('package.json').toString())
    validatePackageJson(packageJson)

    let env = {}
    env = {...process.env, ...getEnvVars()}
}
