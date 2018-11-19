import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'

/**
 * Objectives:
 * - [] test for the existence of an image
 * - [] test that we display number of followers based on props
 * - [] test that the button says "Follow"
 */

describe('App', () => {
  it('should do something', () => {
    const w = mount(<App name="Nicholas Cage" avatar="http://www.placecage.com/c/300/300" followers={42} />)
    // console.log(w.debug())
  })
})
