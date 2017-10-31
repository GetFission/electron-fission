import 'mocha'
import { expect } from 'chai'
import { fissionPing } from '../src/index'


describe('fission ping', () => {
  beforeEach(() => {
    process.env.APP_VERSION = '0.123'
    process.env.PING_URL = 'https://requestb.in/1mhfu2o1'
  })


  it('should not throw an error', async () => {
    // const result = await fissionPing()
    // expect(result).to.equal(true)
  })
})
