import * as fs from 'fs'
import { spawn } from 'child_process'
import * as detectIndent from 'detect-indent'

import * as fission from './index'

export function writePublishSection (packageJsonPath : string, publishInfo : Object) {
  const file = fs.readFileSync(packageJsonPath).toString()
  const indent = detectIndent(file).indent 
  const packageJson = JSON.parse(file)
  packageJson.build.publish = publishInfo
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, indent))
}

export function init (packageJsonPath : string, s3Bucket : string) {
  const publishInfo = {
    provider: "s3",
    bucket: s3Bucket,
    path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
  }
  writePublishSection(packageJsonPath, publishInfo)
}
