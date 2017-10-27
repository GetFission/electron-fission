import * as fs from 'fs'
import { spawn } from 'child_process'

import * as fission from './index'

export function writePublishSection (publishInfo : Object, packageJsonPath : string) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())
  packageJson.build.publish = publishInfo
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, ' '))
}

export function init (packageJsonPath : string, s3Bucket : string) {
  const publishInfo = {
    provider: "s3",
    bucket: s3Bucket,
    path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
  }
  writePublishSection(publishInfo, process.env)
}
