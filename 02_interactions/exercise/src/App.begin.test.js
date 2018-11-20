import React from 'react'
import { mount } from 'enzyme'
import { App } from './App'

/**
 * Testing Objectives:
 * - [] clicking the Follow button increments the number of followers and changes button text to "Unfollow"
 * - [] clicking the "Unfollow" button decrements the number of followers and changes button text to "Follow"
 * - [] button to send a message is initially disabled
 * - [] typing into the message field and clicking to send the message will display a confirmation message
 */

describe('App', () => {
  it('should do something', () => {
    const w = mount(<App />)
  })
})
