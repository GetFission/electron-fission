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

export function publish () : void {
  const packageJson = JSON.parse(fs.readFileSync('package.json').toString())
    validatePackageJson(packageJson)

    let env = {}
    env = {...process.env, ...getEnvVars()}
    let build = spawn('./node_modules/.bin/build', ['-p', 'always'], {env: env})

    build.stdout.on('data', (data) => {
        console.log(`[Builder stdout] ${data}`);
    });

    build.stderr.on('data', (data) => {
        console.log(`[Builder stderr]: ${data}`);
    });

    build.on('close', (code) => {
        console.log(`Builder child process exited with code ${code}`);
        if (code === 0) {
        fission.fissionPing()
          .then(() => console.log('[Ping] successful'))
          .catch(err => console.log('[Ping] Error sending ping:', err))
        }
    });
}
