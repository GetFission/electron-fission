import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import 'mocha'
import { expect } from 'chai'
import { writeElectronBuilderEnvFile } from '../src/prep'


describe('write env file init', () => {
  it('initalizes empty package.json', () => {
    const emptyEnvFilePath = path.join(os.tmpdir(), 'electron-builder.env')
    if (fs.existsSync(emptyEnvFilePath)) {
      fs.unlinkSync(emptyEnvFilePath)
    }
    const expectedEnvFilePath = path.join(__dirname, 'data', 'electron-builder.env')

    const envVars = new Map([["COMMIT", "foo"], ["BRANCH", "bar"]])
    writeElectronBuilderEnvFile(emptyEnvFilePath, envVars)

    const result = fs.readFileSync(emptyEnvFilePath)
    const expected = fs.readFileSync(expectedEnvFilePath)
    expect(result.toString().split(os.EOL)).to.deep.equal(expected.toString().split('\n'))
  })
})
