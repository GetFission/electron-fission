import * as fs from 'fs'
import * as path from 'path'

import 'mocha'
import { expect } from 'chai'
import { writePublishSection } from '../src/init'


describe('fission init', () => {
  // beforeEach(() => {
  // })

  it('initalizes empty package.json', () => {
    const emptyPackageJson = path.join(__dirname, 'data', 'empty-package.json')
    const publishInfo = {
      provider: "s3",
      bucket: "sample-bucket",
      path: '${env.BRANCH}/${env.COMMIT}/${env.PLATFORM}'
    }
    writePublishSection(emptyPackageJson, publishInfo)
    const result = fs.readFileSync(emptyPackageJson)
    const expected = fs.readFileSync(path.join(__dirname, 'data', 'res-empty-package.json'))
    expect(result).to.equal(expected)
  })

  it('initalizes existing package.json', () => {
    // expect(result).to.equal(true)
  })
})
