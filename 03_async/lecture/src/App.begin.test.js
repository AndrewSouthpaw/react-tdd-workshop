import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'

/**
 * Testing Objectives:
 * - [] the component should load the number of followers through a server call, displaying "Loading..." before and
 *      then showing the number of followers that returns from the server call
 */

describe('App', () => {
  it('should do something', () => {
    const w = mount(<App />)
  })
})
