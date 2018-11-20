import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'
import axios from 'axios'
import { flushPromises, serverReturnsSuccess, setupSandbox } from './lib/test_helpers'

describe('App', () => {
  setupSandbox()

  it('should load the number of followers from server', async () => {
    serverReturnsSuccess(42)
    const w = mount(<App />)
    expect(w.text()).toMatch('Followers: (Loading...)')
    await flushPromises()
    expect(w.text()).toMatch('Followers: 42')
    expect(axios.get.args).toEqual([['http://faker.hook.io/?property=random.number']])
  })
})
