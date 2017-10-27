import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import 'mocha'
import { expect } from 'chai'
import { writePublishSection } from '../src/init'


describe('fission init', () => {
  it('initalizes empty package.json', () => {
    const emptyPackageJson = path.join(__dirname, 'data', 'empty-package.json')
    const emptyTestPackageJson = path.join(os.tmpdir(), 'empty-package.json')
    // copy test file to temp dir
    fs.writeFileSync(emptyTestPackageJson, fs.readFileSync(emptyPackageJson))

    const publishInfo = {
      provider: "s3",
      bucket: "sample-bucket",
      path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
    }

    writePublishSection(emptyTestPackageJson, publishInfo)
    const result = fs.readFileSync(emptyTestPackageJson)
    const expected = fs.readFileSync(path.join(__dirname, 'data', 'res-package.json'))
    expect(JSON.parse(result.toString())).to.deep.equal(JSON.parse(expected.toString()))
  })

  it('initalizes existing package.json', () => {
    const existingPackageJson = path.join(__dirname, 'data', 'existing-package.json')
    const existingTestPackageJson = path.join(os.tmpdir(), 'existing-package.json')
    // copy test file to temp dir
    fs.writeFileSync(existingTestPackageJson, fs.readFileSync(existingPackageJson))

    const publishInfo = {
      provider: "s3",
      bucket: "sample-bucket",
      path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
    }

    writePublishSection(existingTestPackageJson, publishInfo)
    const result = fs.readFileSync(existingTestPackageJson)
    const expected = fs.readFileSync(path.join(__dirname, 'data', 'res-package.json'))
    expect(JSON.parse(result.toString())).to.deep.equal(JSON.parse(expected.toString()))
  })
})
